/** pYIN — probabilistic YIN (Mauch & Dixon, 2014). */
export interface PyinOptions {
  /** sample rate (Hz), default 44100 */
  fs?: number
  /** minimum detectable frequency (Hz), default 50 */
  minFreq?: number
  /** maximum detectable frequency (Hz), default 2000 */
  maxFreq?: number
}

/** One candidate period from the Beta(2, 18)-weighted threshold sweep. */
export interface PyinCandidate {
  /** candidate frequency (Hz) */
  freq: number
  /** posterior probability, normalized across all candidates (sums to 1) */
  prob: number
}

/**
 * Single-frame pitch estimate with full posterior over candidate periods.
 * `clarity` is the clamped total probability mass captured by the candidate set.
 * Returns null if no candidate period was found at any threshold.
 */
export default function pyin(data: Float32Array | Float64Array, options?: PyinOptions): { freq: number, clarity: number, candidates: PyinCandidate[] } | null

/**
 * A stage 1 in place of YIN's: called once with the frame size, rate and range; the returned analyzer
 * gets each frame and returns its candidate count, having filled `freq` and `prob` (the pitch
 * probability of each candidate, summing to at most 1) and `rms` (the level Tony's note onsets read).
 */
export interface Candidates {
  (frameSize: number, fs: number, minFreq: number, maxFreq: number): {
    (frame: Float64Array): number
    freq: ArrayLike<number>
    prob: ArrayLike<number>
    rms: number
    /** samples a frame holds, default frameSize */
    frameSize?: number
    /** samples of the frame before its time, default frameSize / 4 (YIN's window centred on it) */
    lead?: number
  }
}

/** Framing of the sequence stages. */
export interface TrackOptions extends PyinOptions {
  /** frame length (samples), default the shortest power of 2 holding two periods of minFreq: 2048 at 44.1 kHz */
  frameSize?: number
  /** hop between frames (samples), default ≈ 5.8 ms: 256 at 44.1 kHz */
  hopSize?: number
  /** frames within which every frame is decided, default 4096: a stream's decisions run at most this far behind its input */
  lag?: number
  /** an observation model in place of YIN's candidates, such as @audio/neural-pitch's; default pYIN's own */
  candidates?: Candidates
}

/** Smoothed f0 track, one entry per frame; frame i is centred at i·hopSize/fs. */
export interface Track {
  /** frame times (s) */
  times: Float64Array
  /** f0 (Hz), 0 where unvoiced */
  f0: Float32Array
  /** 1 voiced, 0 unvoiced */
  voiced: Uint8Array
  /** voiced probability of the frame: the mass of its candidates */
  prob: Float32Array
}

/** Streaming form: each call returns the frames decided so far; call with no block to end. */
export type TrackWriter = (block?: Float32Array | Float64Array) => Track

/** pYIN's pitch HMM, Viterbi-decoded: voiced/unvoiced states over 0.1-semitone pitch bins. */
export function track(data: Float32Array | Float64Array, options?: TrackOptions): Track
export function track(options?: TrackOptions): TrackWriter

export interface NotesOptions extends TrackOptions {
  /** shortest note kept (s), default 0.1 */
  minDuration?: number
}

export interface Note {
  /** onset (s) */
  time: number
  /** seconds */
  duration: number
  /** median pitch of the note's frames (Hz) */
  freq: number
  /** nearest MIDI note of that pitch */
  midi: number
  /** mean voiced probability of the note's frames, 0..1 */
  clarity: number
}

/** Streaming form: each call returns the notes finished so far; call with no block to end. */
export type NotesWriter = (block?: Float32Array | Float64Array) => Note[]

/** Tony's note HMM (Mauch et al., 2015) over the pYIN track: monophonic note events. */
export function notes(data: Float32Array | Float64Array, options?: NotesOptions): Note[]
export function notes(options?: NotesOptions): NotesWriter
