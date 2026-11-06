// FIR convolution EQ — linear-phase filter from an arbitrary magnitude response.
// Frequency-sampling design (odd-length type-I symmetric FIR, Hann-windowed against Gibbs),
// zero-latency apply (group delay compensated).
// FFmpeg firequalizer class; the Matchering match-EQ substrate.

import { fft, ifft } from 'fourier-transform'

/**
 * Design linear-phase FIR coefficients from a magnitude response.
 * @param {Array<{f:number,gain:number}>|function} response — dB gain points (linearly
 *   interpolated over frequency, clamped outside) or `f => dB` function
 * @param {object} opts — { taps=511 (made odd), fs=44100 }
 * @returns {Float64Array} symmetric coefficients
 */
export function design (response, { taps = 511, fs = 44100 } = {}) {
	let N = taps | 1 // force odd (type-I)
	let dbAt
	if (typeof response === 'function') dbAt = response
	else {
		let pts = [...response].sort((a, b) => a.f - b.f)
		dbAt = f => {
			if (f <= pts[0].f) return pts[0].gain
			if (f >= pts[pts.length - 1].f) return pts[pts.length - 1].gain
			for (let i = 1; i < pts.length; i++) {
				if (f <= pts[i].f) {
					let t = (f - pts[i - 1].f) / (pts[i].f - pts[i - 1].f)
					return pts[i - 1].gain + t * (pts[i].gain - pts[i - 1].gain)
				}
			}
			return pts[pts.length - 1].gain
		}
	}

	let half = (N - 1) / 2
	let M = new Float64Array(half + 1)
	for (let k = 0; k <= half; k++) M[k] = 10 ** (dbAt(k * fs / N) / 20)

	// h[n] = (1/N)·[M0 + 2·Σ M_k·cos(2πk(n−α)/N)], α = (N−1)/2 → symmetric, linear phase
	let h = new Float64Array(N)
	for (let n = 0; n < N; n++) {
		let sum = M[0]
		for (let k = 1; k <= half; k++) sum += 2 * M[k] * Math.cos(2 * Math.PI * k * (n - half) / N)
		let win = 0.5 - 0.5 * Math.cos(2 * Math.PI * n / (N - 1)) // Hann against Gibbs ripple
		h[n] = (sum / N) * win
	}
	return h
}

/**
 * Apply the EQ in place, delay-compensated (output time-aligned with input).
 * @param {Float32Array} data — mono PCM
 * @param {object} opts — { response, taps, fs } or precomputed { coefs }
 */
export default function firEq (data, opts = {}) {
	let h = opts.coefs || design(opts.response, opts)
	data.set(h.length > 32 ? overlapAdd(data, h) : direct(data, h))
	return data
}

// Short kernels: the sum itself. out[i] = Σ h[j]·x[i − j + half], outside the input taken as silence.
function direct (data, h) {
	let N = h.length, half = (N - 1) / 2, out = new Float32Array(data.length)
	for (let i = 0; i < data.length; i++) {
		let sum = 0
		for (let j = 0; j < N; j++) {
			let idx = i - j + half
			if (idx >= 0 && idx < data.length) sum += h[j] * data[idx]
		}
		out[i] = sum
	}
	return out
}

// Long kernels: the same sum by FFT overlap-add, O(n·log N) instead of O(n·N). Blocks of `size − N + 1` input
// samples, zero-padded to a power of two ≥ 4N, multiplied by the kernel's spectrum; tails overlap into the next block.
function overlapAdd (data, h) {
	let N = h.length, half = (N - 1) / 2, L = data.length
	let size = 2 ** Math.ceil(Math.log2(4 * N)), B = size - N + 1, bins = size / 2 + 1
	let blk = new Float64Array(size)
	blk.set(h)
	let [r0, i0] = fft(blk), hr = Float64Array.from(r0), hi = Float64Array.from(i0)  // fft reuses its output buffers
	let yr = new Float64Array(bins), yi = new Float64Array(bins), acc = new Float64Array(L + N)
	for (let s = 0; s < L; s += B) {
		let m = Math.min(B, L - s)
		blk.fill(0)
		for (let i = 0; i < m; i++) blk[i] = data[s + i]
		let [xr, xi] = fft(blk)
		for (let k = 0; k < bins; k++) { yr[k] = xr[k] * hr[k] - xi[k] * hi[k]; yi[k] = xr[k] * hi[k] + xi[k] * hr[k] }
		let y = ifft(yr, yi)
		for (let i = 0, e = Math.min(m + N - 1, acc.length - s); i < e; i++) acc[s + i] += y[i]
	}
	return acc.subarray(half, half + L)
}
