// pYIN stage 1: YIN over a distribution of thresholds (Mauch & Dixon, ICASSP 2014).
//
// The difference function is YIN's, eq. 6: d(τ) = Σ_{j<W} (x_j − x_{j+τ})² over the first
// half of the frame (W = N/2), computed through the FFT. Its cumulative mean normalized form
// d′ (eq. 8) is searched for troughs. Each of 100 thresholds s = 0.01…1 carries the mass of a
// Beta(2, 18) prior (mean 0.1); the troughs below a threshold share its mass by a Boltzmann(2)
// prior over their order, so shorter periods weigh more; when no trough is below it, 1% of its
// mass goes to the global minimum. This is librosa.pyin's frame stage (defaults
// beta_parameters=(2, 18), boltzmann_parameter=2, no_trough_prob=0.01), which follows the
// official pYIN software of 2014.

import { fft, ifft } from 'fourier-transform'

// regularized incomplete beta I_x(2, 18), closed form for integer shapes
const cdf = x => 1 - (1 - x) ** 19 - 19 * x * (1 - x) ** 18
const THRESHOLDS = 100
const BETA = Float64Array.from({ length: THRESHOLDS }, (_, i) => cdf((i + 1) / THRESHOLDS) - cdf(i / THRESHOLDS))
const REST = BETA.map((_, i) => BETA.subarray(i).reduce((a, b) => a + b, 0))   // mass of thresholds i…
const LAMBDA = 2, NO_TROUGH = 0.01

/**
 * Candidate analyzer for frames of `N` samples. Returns `frame → count` and fills its own
 * `freq`, `prob` (candidates in order of increasing period) and `rms` (level of the YIN
 * integration window). Buffers are reused: read them before the next call.
 */
export default function candidates(N, fs, minFreq, maxFreq) {
  let W = N >> 1
  let tauMin = Math.max(1, Math.floor(fs / maxFreq))
  let tauMax = Math.min(Math.ceil(fs / minFreq), N - W)
  let span = Math.max(0, tauMax - tauMin + 1)
  let L = 2 ** Math.ceil(Math.log2(Math.max(N, 2))), half = L >> 1
  let x = new Float64Array(L), a = new Float64Array(L), r = new Float64Array(L)
  let X = [new Float64Array(half + 1), new Float64Array(half + 1)], A = [new Float64Array(half + 1), new Float64Array(half + 1)]
  let cm = new Float64Array(tauMax + 2)
  let tr = new Int32Array(span), rank = new Int32Array(span), p = new Float64Array(span)
  // Boltzmann(λ, n) pmf at rank k: decay[k]·norm[n]
  let decay = Float64Array.from({ length: span + 1 }, (_, i) => Math.exp(-LAMBDA * i))
  let norm = decay.map((d, n) => (1 - decay[1]) / (1 - d))

  function run(frame) {
    let n = Math.min(frame.length, N), e0 = 0
    for (let i = 0; i < L; i++) { x[i] = i < n ? frame[i] : 0; a[i] = i < W ? x[i] : 0 }
    for (let i = 0; i < W; i++) e0 += x[i] * x[i]
    run.rms = Math.sqrt(e0 / W)
    if (span < 3 || !(e0 > 0)) return 0

    // r(τ) = Σ_{j<W} x_j x_{j+τ} as conj(A)·X; no wrap-around for τ ≤ N − W < L
    fft(x, X); fft(a, A)
    let [Xr, Xi] = X, [Ar, Ai] = A
    for (let k = 0; k <= half; k++) {
      let re = Ar[k] * Xr[k] + Ai[k] * Xi[k]
      Xi[k] = Ar[k] * Xi[k] - Ai[k] * Xr[k]; Xr[k] = re
    }
    ifft(Xr, Xi, r)

    // d′(τ) = d(τ)·τ / Σ_{j≤τ} d(j); FFT rounding below 1e-12 of the window energies is zero
    let et = e0, sum = 0
    cm[0] = 1
    for (let tau = 1; tau <= tauMax; tau++) {
      et += x[tau + W - 1] * x[tau + W - 1] - x[tau - 1] * x[tau - 1]
      let d = e0 + et - 2 * r[tau]
      if (d < 1e-12 * (e0 + et)) d = 0
      sum += d
      cm[tau] = sum > 0 ? d * tau / sum : 1
    }

    // troughs of d′ over [tauMin, tauMax] (librosa.util.localmin, with pyin's edge rules)
    let nt = 0, last = span - 1
    for (let k = 0; k <= last; k++) {
      let v = cm[tauMin + k]
      if (k === 0 ? v < cm[tauMin + 1] : k === last ? v < cm[tauMin + k - 1] : v < cm[tauMin + k - 1] && v <= cm[tauMin + k + 1]) tr[nt++] = k
    }
    if (!nt) return 0

    // each threshold's mass → the troughs below it by Boltzmann rank, or 1% of it → global minimum;
    // past the highest trough the ranks stop changing, so the remaining mass goes in one step
    let gmin = 0, top = 0, none = 0
    for (let t = 0; t < nt; t++) {
      let h = cm[tauMin + tr[t]]
      p[t] = 0
      if (h < cm[tauMin + tr[gmin]]) gmin = t
      if (h > top) top = h
    }
    for (let i = 0; i < THRESHOLDS; i++) {
      let s = (i + 1) / THRESHOLDS, below = 0, all = s > top
      for (let t = 0; t < nt; t++) rank[t] = cm[tauMin + tr[t]] < s ? below++ : -1
      if (!below) { none += BETA[i]; continue }
      let c = (all ? REST[i] : BETA[i]) * norm[below]
      for (let t = 0; t < nt; t++) if (rank[t] >= 0) p[t] += c * decay[rank[t]]
      if (all) break
    }
    p[gmin] += NO_TROUGH * none

    // parabolic refinement of each period; none at the range edges or beyond ±1 lag (as librosa)
    let m = 0
    for (let t = 0; t < nt; t++) {
      if (!(p[t] > 0)) continue
      let k = tr[t], tau = tauMin + k, shift = 0
      if (k > 0 && k < last) {
        let s0 = cm[tau - 1], s1 = cm[tau], s2 = cm[tau + 1]
        let aa = s2 + s0 - 2 * s1, bb = (s2 - s0) / 2
        if (Math.abs(bb) < Math.abs(aa)) shift = -bb / aa
      }
      run.freq[m] = fs / (tau + shift)
      run.prob[m++] = p[t]
    }
    return m
  }
  run.freq = new Float64Array(span)
  run.prob = new Float64Array(span)
  run.rms = 0
  return run
}
