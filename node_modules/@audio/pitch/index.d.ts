// @audio/pitch — pitch detection umbrella re-exporting every @audio/pitch-* atom.
// For smaller bundles, depend directly on the individual atom.
// Chroma / chord / key detection moved to @audio/mir.

export { default as yin } from '@audio/pitch-yin'
export { default as mcleod } from '@audio/pitch-mcleod'
export { default as pyin } from '@audio/pitch-pyin'
export { default as hps } from '@audio/pitch-hps'
export { default as cepstrum } from '@audio/pitch-cepstrum'
export { default as swipe } from '@audio/pitch-swipe'
export { default as autocorrelation } from '@audio/pitch-autocorrelation'
export { default as amdf } from '@audio/pitch-amdf'
export type { AmdfOptions } from '@audio/pitch-amdf'
export type { AutocorrelationOptions } from '@audio/pitch-autocorrelation'
export type { CepstrumOptions } from '@audio/pitch-cepstrum'
export type { HpsOptions } from '@audio/pitch-hps'
export type { McleodOptions } from '@audio/pitch-mcleod'
export type { PyinOptions, PyinCandidate } from '@audio/pitch-pyin'
export type { SwipeOptions } from '@audio/pitch-swipe'
export type { YinOptions } from '@audio/pitch-yin'
