# @audio/pitch-pyin [![npm](https://img.shields.io/npm/v/@audio/pitch-pyin)](https://www.npmjs.com/package/@audio/pitch-pyin) [![MIT](https://img.shields.io/badge/MIT-%E0%A5%90-white)](https://github.com/krishnized/license)

pYIN — probabilistic YIN (Mauch & Dixon, 2014)

```
npm install @audio/pitch-pyin
```

```js
import pyin, { track, notes } from '@audio/pitch-pyin'
```

**Mauch & Dixon, 2014.** Probabilistic YIN — runs YIN at multiple thresholds weighted by a Beta(2, 18) prior, producing a distribution over candidate pitches instead of a single hard pick. More robust than YIN on ambiguous frames.

```js
let result = pyin(samples, { fs: 44100 })
// → { freq: 440.1, clarity: 0.92, candidates: [{ freq: 440.1, prob: 0.85 }, ...] }
```

| Param | Default | |
|---|---|---|
| `fs` | `44100` | Sample rate (Hz) |
| `minFreq` | `50` | Minimum detectable frequency (Hz) |
| `maxFreq` | `2000` | Maximum detectable frequency (Hz) |

Unlike the other atoms, the single-frame result also carries `candidates` — the full posterior over detected periods, sorted by probability, each `{ freq, prob }` with `prob` normalized to sum to 1 across candidates. `clarity` is the (clamped) total probability mass captured by the candidate set, not a single-peak confidence.

Over a sequence of frames, `track` runs pYIN's second stage and `notes` segments its result into notes:

```js
let { times, f0, voiced, prob } = track(samples, { fs: 44100 })   // frame i at i·hopSize/fs, f0 0 where unvoiced
let events = notes(samples, { fs: 44100 })                        // → [{ time, duration, freq, midi, clarity }, ...]

let write = notes({ fs: 44100 })   // streaming, track too
write(block)                       // → the notes finished so far
write()                            // → the rest
```

| Param | Default | |
|---|---|---|
| `frameSize` | `2048` at 44.1 kHz | Frame (samples): the shortest power of 2 whose YIN window holds a period of `minFreq` |
| `hopSize` | `256` at 44.1 kHz | Hop (samples), ≈ 5.8 ms |
| `lag` | `4096` | Frames within which every frame is decided: a stream runs at most this far behind its input |
| `minDuration` | `0.1` | `notes`: shortest note kept (s) |
| `candidates` | YIN's | Stage 1: another observation model for the HMM, such as [`@audio/neural-pitch`](https://github.com/audiojs/neural/tree/main/packages/neural-pitch)'s |

`track` Viterbi-decodes pYIN's pitch HMM. States are 0.1-semitone bins from `minFreq` to `maxFreq`, voiced or unvoiced; pitch moves at most 35.92 octaves per second and voicing switches with probability 0.01 (librosa.pyin's defaults). Voiced states take half their candidates' probability (the Vamp plugin's `yinTrust`), which keeps an unvoiced path open, so a leap between notes is not followed an octave off. A frame is decided once every Viterbi path through it agrees, or, if they have not met within `lag` frames, along the best path then (fixed-lag decoding, as the pYIN Vamp plugin): memory stays bounded at any length, and a stream with a short `lag` decides each frame a fixed latency behind its input. Against librosa.pyin 1.0: the difference function is YIN's own (librosa zero-extends the frame, which pulls low pitches sharp), candidates in one bin add up, and `f0` is the candidate inside the decoded bin, not the bin centre.

`notes` is Tony's note model, with the pYIN Vamp plugin's parameters and output: attack, stable and silent states for 3 pitches per semitone. Vibrato and a scoop into a note stay inside it; the same pitch played again starts a new note where the level rises 1/0.7-fold within two frames; a fast glide joins the notes at its ends, a slow one steps through the notes it passes. `freq` is the median pitch of the note's frames, `clarity` their mean voiced probability.

`candidates` replaces stage 1 and leaves the HMM and the note model as they are. It has `candidates.js`'s signature: `(frameSize, fs, minFreq, maxFreq) → run`, where `run(frame)` returns the candidate count after filling `run.freq`, `run.prob` (each candidate's pitch probability, at most 1 in all) and `run.rms` (the level the note onsets read); `run.frameSize` and `run.lead` set how many samples a frame holds and how many of them precede its time. Without it the output is the same, bit for bit.

**Use when:** Ambiguous pitched content — breathy vocals, noisy recordings, or when you need a pitch posterior for downstream HMM tracking. Melody of a voice or solo instrument: smoothed f0 with voicing (`track`), note events (`notes`).<br>
**Not for:** Polyphonic audio: one pitch per frame.<br>
**Ref:** Mauch & Dixon, ["pYIN: A Fundamental Frequency Estimator Using Probabilistic Threshold Distributions"](https://doi.org/10.1109/ICASSP.2014.6853678), ICASSP 2014. Mauch et al., ["Computer-aided Melody Note Transcription Using the Tony Software: Accuracy and Efficiency"](https://www.tenor-conference.org/proceedings/2015/04-Mauch-Tony.pdf), TENOR 2015.

---

Part of [@audio/pitch](https://github.com/audiojs/pitch) — the pitch family umbrella. This README is generated from the umbrella docs.

MIT © [audiojs](https://github.com/audiojs)
