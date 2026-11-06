/**
 * pYIN — probabilistic YIN (Mauch & Dixon, 2014).
 *
 * Runs YIN over 100 thresholds weighted by a Beta(2, 18) prior, producing a distribution
 * over candidate periods instead of a single hard pick. For a single frame the function
 * returns the most probable candidate; the full posterior is exposed via `candidates`.
 *
 * The sequence stages live beside it: `track()` Viterbi-decodes the pitch HMM over frames
 * (smoothed f0 with voicing), `notes()` segments that track into notes with Tony's note HMM.
 *
 * @param {Float32Array | Float64Array} data - window of samples
 * @param {{fs?: number, minFreq?: number, maxFreq?: number}} [params]
 * @returns {{freq: number, clarity: number, candidates: {freq: number, prob: number}[]} | null}
 */

import candidates from './candidates.js'

export { track } from './track.js'
export { notes } from './notes.js'

let last, lastKey

export default function pyin(data, params) {
  let fs = params?.fs || 44100
  let minFreq = params?.minFreq ?? 50
  let maxFreq = params?.maxFreq ?? 2000
  let key = `${data.length} ${fs} ${minFreq} ${maxFreq}`
  if (key !== lastKey) { last = candidates(data.length, fs, minFreq, maxFreq); lastKey = key }

  let m = last(data)
  if (!m) return null
  let total = 0, list = []
  for (let i = 0; i < m; i++) { total += last.prob[i]; list.push({ freq: last.freq[i], prob: last.prob[i] }) }
  list.sort((a, b) => b.prob - a.prob)
  for (let c of list) c.prob /= total

  return { freq: list[0].freq, clarity: Math.min(1, total), candidates: list }
}
