// pYIN stage 2: the pitch HMM (Mauch & Dixon, ICASSP 2014), Viterbi-decoded.
//
// Hidden states are pitch bins at 0.1 semitone from minFreq to maxFreq, each voiced or unvoiced.
// A voiced bin emits half the probability of the frame's candidates that fall in it; every
// unvoiced bin emits (1 − half the voiced probability) / bins. Pitch moves by at most 35.92
// octaves per second, with triangular weights inside that band; voicing switches with
// probability 0.01. Bins, rate and switch are librosa.pyin's defaults (resolution,
// max_transition_rate, switch_prob), after the paper's ±25 bins per 256 samples at 44.1 kHz.
// The halving is the pYIN Vamp plugin's yinTrust 0.5: an unvoiced path always stays open, so a
// jump wider than the band (a leap between notes) need not ride an octave candidate instead.
// A voiced frame reports the candidate frequency inside its decoded bin, as the plugin does.

import candidates from './candidates.js'
import viterbi from './viterbi.js'

const RES = 10, RATE = 35.92, SWITCH = 0.01, TRUST = 0.5
const TINY = 2.2250738585072014e-308    // float64 tiny: floor of log-probabilities, as librosa

/** Voiced/unvoiced pitch-bin HMM with banded triangular transitions. */
export function pitchModel(fs, hop, minFreq, maxFreq) {
  let n = Math.floor(12 * RES * Math.log2(maxFreq / minFreq)) + 1
  let h = Math.max(1, Math.round(RATE * 12 * hop / fs)) * RES >> 1
  // lw[b·w + k − b + h]: log weight of k → b, rows k normalized over their (edge-cut) band
  let w = 2 * h + 1, lw = new Float64Array(n * w), sum = new Float64Array(n)
  for (let k = 0; k < n; k++) for (let j = Math.max(0, k - h); j <= Math.min(n - 1, k + h); j++) sum[k] += h + 1 - Math.abs(j - k)
  for (let b = 0; b < n; b++) for (let k = Math.max(0, b - h); k <= Math.min(n - 1, b + h); k++) lw[b * w + k - b + h] = Math.log((h + 1 - Math.abs(b - k)) / sum[k])
  let stay = Math.log(1 - SWITCH), jump = Math.log(SWITCH), init = Math.log(1 / (2 * n))

  return {
    S: 2 * n, n,
    // nearest bin; −1 above the range (the edge trough at the shortest lag is no candidate), as librosa
    bin: f => { let b = Math.max(0, Math.round(12 * RES * Math.log2(f / minFreq))); return b < n ? b : -1 },
    freq: b => minFreq * 2 ** (b / (12 * RES)),
    init(delta, obs) { for (let j = 0; j < 2 * n; j++) delta[j] = init + obs[j] },
    step(delta, next, psi, obs) {
      for (let b = 0; b < n; b++) {
        let lo = Math.max(0, b - h), hi = Math.min(n - 1, b + h), o = b * w - b + h
        let mv = -Infinity, av = lo, mu = -Infinity, au = lo
        for (let k = lo; k <= hi; k++) {
          let t = lw[o + k], v = delta[k] + t, u = delta[n + k] + t
          if (v > mv) { mv = v; av = k }
          if (u > mu) { mu = u; au = k }
        }
        // voiced predecessors precede unvoiced ones: ties go to the voiced state
        if (mv + stay >= mu + jump) { next[b] = obs[b] + mv + stay; psi[b] = av }
        else { next[b] = obs[b] + mu + jump; psi[b] = n + au }
        if (mv + jump >= mu + stay) { next[n + b] = obs[n + b] + mv + jump; psi[n + b] = av }
        else { next[n + b] = obs[n + b] + mu + stay; psi[n + b] = n + au }
      }
    }
  }
}

/**
 * Options with their defaults. The frame is the shortest power of 2 whose YIN window holds a period
 * of minFreq (2048 at 44.1 kHz), the hop ≈ 5.8 ms (256 at 44.1 kHz): the pYIN Vamp plugin's. Every
 * frame is decided within `lag` frames of the last one read (viterbi.js), so a stream can run a fixed
 * latency behind its input.
 */
export function settings({ fs = 44100, minFreq = 50, maxFreq = 2000, frameSize, hopSize, lag = 4096 } = {}) {
  if (!(minFreq > 0 && maxFreq > minFreq)) throw new RangeError(`pyin: need 0 < minFreq < maxFreq, got ${minFreq}, ${maxFreq}`)
  if (!(lag >= 1)) throw new RangeError(`pyin: need lag ≥ 1, got ${lag}`)
  frameSize ??= 2 ** Math.ceil(Math.log2(2 * fs / minFreq))
  hopSize ??= Math.round(fs * 256 / 44100)
  return { fs, minFreq, maxFreq, frameSize, hopSize, lag }
}

/** Frames of N samples every H, frame i from `lead` samples before sample i·H (N/4: YIN's window centred on it). */
export function framer(N, H, lead = N >> 2) {
  let buf = new Float64Array(2 * N), len = lead, start = -lead, i = 0, total = 0
  function run(fn) {
    let off = i * H - lead - start
    for (; off + N <= len; off += H) fn(buf.subarray(off, off + N), i++)
    if (off > 0) { off = Math.min(off, len); buf.copyWithin(0, off, len); len -= off; start += off }
  }
  function add(block) {
    if (len + block.length > buf.length) {
      let b = new Float64Array(2 * (len + block.length)); b.set(buf.subarray(0, len)); buf = b
    }
    buf.set(block, len); len += block.length
  }
  return {
    push(block, fn) { total += block.length; add(block); run(fn) },
    // zero-pad through the last frame: frames 0…⌊samples / H⌋, as librosa's centred framing
    end(fn) {
      if (!total) return
      let need = Math.floor(total / H) * H - lead + N - (start + len)
      if (need > 0) add(new Float64Array(need))
      run(fn)
    }
  }
}

/**
 * Frame analysis + pitch decoding. `onFrame(rec)` receives each frame's record once decided:
 * { i, rms, prob (voiced probability), f0 (Hz, 0 unvoiced) }.
 * `opts.candidates` replaces stage 1: a factory with the signature and result of candidates.js, whose
 * run may set `frameSize` and `lead` (samples it reads, and how many of them precede the frame's time).
 */
export function pitchTracker(opts, onFrame) {
  let { fs, minFreq, maxFreq, frameSize, hopSize, lag } = settings(opts)
  let run = (opts?.candidates ?? candidates)(frameSize, fs, minFreq, maxFreq)
  let model = pitchModel(fs, hopSize, minFreq, maxFreq), { n } = model
  let obs = new Float64Array(2 * n), p = new Float64Array(n), floor = Math.log(TINY), queue = [], head = 0, base = 0
  let decode = viterbi(model, (s, f) => {
    let r = queue[f - base]
    r.f0 = 0
    if (s < n) {
      let c = model.freq(s), best = Infinity
      for (let k = 0; k < r.bins.length; k++) if (r.bins[k] === s) {
        let d = Math.abs(Math.log(r.freqs[k] / c))
        if (d < best) { best = d; r.f0 = r.freqs[k] }
      }
      if (!r.f0) r.f0 = c
    }
    r.bins = r.freqs = null
    queue[f - base] = null; head++
    if (head > 1024) { queue = queue.slice(head); base += head; head = 0 }
    onFrame(r)
  }, lag)
  let frames = framer(run.frameSize ?? frameSize, hopSize, run.lead)
  let analyze = (frame, i) => {
    let m = run(frame), v = 0
    let rec = { i, rms: run.rms, prob: 0, f0: 0, bins: new Int32Array(m), freqs: run.freq.slice(0, m) }
    obs.fill(floor, 0, n)
    for (let k = 0; k < m; k++) { let b = rec.bins[k] = model.bin(run.freq[k]); if (b >= 0) p[b] += run.prob[k], v += run.prob[k] }
    for (let k = 0; k < m; k++) { let b = rec.bins[k]; if (b >= 0 && p[b]) obs[b] = Math.log(TRUST * p[b] + TINY), p[b] = 0 }
    rec.prob = v = Math.min(1, v)
    obs.fill(Math.log((1 - TRUST * v) / n + TINY), n)
    queue.push(rec)
    decode(obs)
  }
  return {
    push: block => frames.push(block, analyze),
    end: () => { frames.end(analyze); decode.end() }
  }
}

/**
 * Smoothed f0 track: `track(samples, opts)` → { times, f0, voiced, prob }, frame i at i·hopSize/fs.
 * `track(opts)` → `write(block)` streams, returning the frames decided so far; `write()` ends.
 */
export function track(data, opts) {
  if (!ArrayBuffer.isView(data) && !Array.isArray(data)) return writer(data)
  let write = writer(opts), a = write(data), b = write()
  let cat = (x, y) => { let o = new x.constructor(x.length + y.length); o.set(x); o.set(y, x.length); return o }
  return { times: cat(a.times, b.times), f0: cat(a.f0, b.f0), voiced: cat(a.voiced, b.voiced), prob: cat(a.prob, b.prob) }
}

function writer(opts) {
  let { fs, hopSize } = settings(opts), t = hopSize / fs, out = []
  let tr = pitchTracker(opts, r => out.push(r))
  return block => {
    block ? tr.push(block) : tr.end()
    let res = {
      times: Float64Array.from(out, r => r.i * t), f0: Float32Array.from(out, r => r.f0),
      voiced: Uint8Array.from(out, r => r.f0 > 0), prob: Float32Array.from(out, r => r.prob)
    }
    out = []
    return res
  }
}
