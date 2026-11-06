// Notes from the pYIN track: Tony's note model (Mauch et al., TENOR 2015), parameters as the
// pYIN Vamp plugin's MonoNoteParameters.
//
// Every note pitch, 3 per semitone, has an attack, a stable and a silent state. Attack and
// stable states emit the tracked pitch through a Gaussian of 5 and 0.8 semitones, so a scoop
// into a note and a ±½ semitone vibrato both stay inside it; silent states emit the unvoiced
// share. A note ends through its silent state, and the next starts on an attack whose interval
// from the last note is weighted by a Gaussian of 0.7 semitones (0 or 0.5…13 semitones apart).
// Segmentation as Tony: a note runs over contiguous attack/stable frames with a voiced pitch;
// a level rise above 1/0.7 within two frames starts a new note (re-articulation); notes under
// 0.1 s are dropped; the pitch is the median of the note's frame pitches.

import viterbi from './viterbi.js'
import { pitchTracker, settings } from './track.js'

const PPS = 3                                       // pitch states per semitone
const ATTACK = 0.9, STABLE = 0.99, SILENT = 0.9999  // self-transitions; stable → silent 0.01
const JUMP = 0.7, MIN_JUMP = 0.5, MAX_JUMP = 13     // interval prior between notes, semitones
const SD_ATTACK = 5, SD_STABLE = 0.8                // pitch spread of attack / stable states, semitones
const VOICED = 0.9, PRIOR = 0.7, PRIOR_WEIGHT = 0.5 // tracked pitch enters with probability 0.9
const SENSITIVITY = 0.7, MIN_DURATION = 0.1

const midi = f => 69 + 12 * Math.log2(f / 440)

/** Note HMM over `count` pitches from `low` (MIDI) in steps of 1/3 semitone. States 3p + {0 attack, 1 stable, 2 silent}. */
export function noteModel(low, count) {
  let S = 3 * count, reach = Math.ceil(MAX_JUMP * PPS) - 1, w = 2 * reach + 1
  let lj = new Float64Array(count * w).fill(-Infinity)       // silent p → attack p + d
  let pdf = (x, sd) => Math.exp(-x * x / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI))
  for (let p = 0; p < count; p++) {
    let sum = 0, ok = d => { let s = Math.abs(d) / PPS; return s === 0 || (s > MIN_JUMP && s < MAX_JUMP) }
    for (let q = Math.max(0, p - reach); q <= Math.min(count - 1, p + reach); q++) if (ok(q - p)) sum += pdf((q - p) / PPS, JUMP)
    for (let q = Math.max(0, p - reach); q <= Math.min(count - 1, p + reach); q++)
      if (ok(q - p)) lj[p * w + q - p + reach] = Math.log((1 - SILENT) * pdf((q - p) / PPS, JUMP) / sum)
  }
  let la = Math.log(ATTACK), las = Math.log(1 - ATTACK), ls = Math.log(STABLE), lss = Math.log(1 - STABLE)
  let lsil = Math.log(SILENT), init = Math.log(1 / count)

  // observation: MIDI pitch of a voiced frame, or NaN
  let obs = new Float64Array(S)
  let emit = m => {
    let pitched = (m === m ? VOICED : 0) * (1 - PRIOR_WEIGHT) + PRIOR * PRIOR_WEIGHT
    let silent = Math.log((1 - pitched) / count)
    if (m === m) {
      let sum = 0
      for (let p = 0; p < count; p++) {
        let mu = low + p / PPS
        sum += obs[3 * p] = pdf(m - mu, SD_ATTACK)
        sum += obs[3 * p + 1] = pdf(m - mu, SD_STABLE)
      }
      let k = Math.log(pitched / sum)
      for (let p = 0; p < count; p++) { obs[3 * p] = Math.log(obs[3 * p]) + k; obs[3 * p + 1] = Math.log(obs[3 * p + 1]) + k }
    } else {
      let v = Math.log(pitched / (2 * count))
      for (let p = 0; p < count; p++) obs[3 * p] = obs[3 * p + 1] = v
    }
    for (let p = 0; p < count; p++) obs[3 * p + 2] = silent
    return obs
  }

  return {
    S, emit,
    init(delta, o) { for (let s = 0; s < S; s++) delta[s] = s % 3 === 2 ? init + o[s] : -Infinity },
    // candidates in the order of the plugin's sparse transition list, so ties resolve alike
    step(delta, next, psi, o) {
      for (let q = 0; q < count; q++) {
        let a = 3 * q, st = a + 1, sl = a + 2
        let best = -Infinity, arg = a, lo = Math.max(0, q - reach), hi = Math.min(count - 1, q + reach)
        for (let p = lo; p <= hi; p++) {
          if (p === q) { let v = delta[a] + la; if (v > best) { best = v; arg = a } }
          let v = delta[3 * p + 2] + lj[p * w + q - p + reach]
          if (v > best) { best = v; arg = 3 * p + 2 }
        }
        next[a] = best + o[a]; psi[a] = arg
        let x = delta[a] + las, y = delta[st] + ls
        if (y > x) { next[st] = y + o[st]; psi[st] = st } else { next[st] = x + o[st]; psi[st] = a }
        x = delta[st] + lss; y = delta[sl] + lsil
        if (y > x) { next[sl] = y + o[sl]; psi[sl] = sl } else { next[sl] = x + o[sl]; psi[sl] = st }
      }
    }
  }
}

/**
 * Tony's segmentation of decided frames { f0, rms, prob, kind: 0 attack | 1 stable | 2 silent }
 * into notes. Returns `push(frame)` giving finished notes, `push.end()` for the rest.
 */
export function segmenter({ fs, hopSize, minDuration = MIN_DURATION }, emit) {
  let minFrames = fs * minDuration / hopSize, buf = [], cur = null
  let close = end => {
    if (cur.pitches.length >= minFrames) {
      let m = cur.pitches.sort((a, b) => a - b)[cur.pitches.length >> 1]
      emit({ time: cur.start * hopSize / fs, duration: (end - cur.start) * hopSize / fs, freq: 440 * 2 ** ((m - 69) / 12), midi: Math.round(m), clarity: cur.prob / cur.pitches.length })
    }
    cur = null
  }
  // frame i is inside a note unless silent, unvoiced or two frames before a level rise
  let step = (r, rise, last) => {
    let on = r.kind < 2 && r.f0 > 0 && !rise && !last
    if (on) {
      cur ??= { start: r.i, pitches: [], prob: 0 }
      cur.pitches.push(midi(r.f0)); cur.prob += r.prob
    } else if (cur) close(r.i)
  }
  let push = r => {
    buf.push(r)
    if (buf.length > 2) { let f = buf.shift(); step(f, !(f.rms / buf[1].rms > SENSITIVITY), false) }
  }
  push.end = () => {
    // the last two frames have no level lookahead; the very last never starts or extends a note (as Tony)
    buf.forEach((f, k) => step(f, false, k === buf.length - 1))
    buf = []
  }
  return push
}

/**
 * Notes from samples: `notes(samples, opts)` → [{ time, duration, freq, midi, clarity }].
 * `notes(opts)` → `write(block)` streams, returning the notes finished so far; `write()` ends.
 */
export function notes(data, opts) {
  if (!ArrayBuffer.isView(data) && !Array.isArray(data)) return writer(data)
  let write = writer(opts)
  return [...write(data), ...write()]
}

function writer(opts) {
  let cfg = settings(opts), low = Math.floor(midi(cfg.minFreq)), count = PPS * (Math.ceil(midi(cfg.maxFreq)) - low) + 1
  let out = [], queue = [], base = 0
  let seg = segmenter({ ...cfg, minDuration: opts?.minDuration }, n => out.push(n))
  let model = noteModel(low, count)
  let decode = viterbi(model, (s, f) => {
    let r = queue[f - base]
    r.kind = s % 3
    queue[f - base] = null
    if (f - base > 1024) { queue = queue.slice(f - base + 1); base = f + 1 }
    seg(r)
  })
  let tr = pitchTracker({ ...cfg, candidates: opts?.candidates }, r => { queue.push(r); decode(model.emit(r.f0 > 0 ? midi(r.f0) : NaN)) })
  return block => {
    if (block) tr.push(block)
    else { tr.end(); decode.end(); seg.end() }
    let res = out
    out = []
    return res
  }
}
