/**
 * Graphic equalizer using ISO octave-band center frequencies.
 *
 * @module  audio-filter/eq/graphic-eq
 */

import { peaking, filter } from '@audio/biquad'

// ISO 266 / IEC 61260 1/1-octave nominal center frequencies
let BANDS = [31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]

/**
 * @param {Float64Array} data - Input (modified in-place)
 * @param {object} params - { gains: {31.5: dB, 63: dB, ...}, fs }
 */
export default function graphicEq (data, params) {
	let fs = params.fs || 44100
	let gains = params.gains || {}

	// New coefficients when gains or fs change; each band keeps its filter state, so a moving gain (automation, a
	// slider) doesn't restart the filters.
	let key = fs + ':' + JSON.stringify(gains)
	if (params._key !== key) {
		params._filters ??= BANDS.map(() => ({}))
		for (let i = 0; i < BANDS.length; i++) {
			let fc = BANDS[i], g = gains[fc] || gains[Math.round(fc)] || 0
			Object.assign(params._filters[i], { coefs: peaking(fc, 1.4, fs, g), flat: !g })
		}
		params._key = key
	}

	// A band at 0 dB is the identity biquad (b = a): it runs while its state rings out from the gain it left, so
	// returning to 0 dB and leaving it stay continuous; at rest it is skipped, state cleared (a flat band costs nothing).
	for (let f of params._filters) {
		let s = f.state?.[0]
		if (!f.flat || s && Math.abs(s[0]) + Math.abs(s[1]) > 1e-30) filter(data, f)
		else f.state = null
	}

	return data
}
