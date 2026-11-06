/**
 * Low-shelf filter — boost or cut below a corner frequency.
 * RBJ biquad shelf design.
 *
 * @module  audio-filter/eq/lowshelf
 */

import { lowshelf, filter } from '@audio/biquad'

export default function lowShelf (data, params) {
	let fc = params.fc || 200, gain = params.gain || 0
	let Q = params.Q == null ? 0.707 : params.Q, fs = params.fs || 44100

	if (!params._lo || params._fc !== fc || params._gain !== gain || params._Q !== Q || params._fs !== fs) {
		// new coefficients, the same state: a parameter moving (automation, a slider) must not restart the filter
		params._lo ??= {}
		params._lo.coefs = [lowshelf(fc, Q, fs, gain)]
		params._fc = fc; params._gain = gain; params._Q = Q; params._fs = fs
	}

	return filter(data, params._lo)
}
