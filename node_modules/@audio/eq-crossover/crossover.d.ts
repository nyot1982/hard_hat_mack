/** One second-order section — RBJ cookbook coefficients, normalized (a0 = 1). */
export interface SOSSection {
  b0: number
  b1: number
  b2: number
  a1: number
  a2: number
}

/**
 * Design an N-way Linkwitz-Riley crossover network. This is a **designer**, not a filter:
 * it takes no audio buffer and processes nothing — it returns per-band SOS cascades to
 * feed a filter engine (e.g. `@audio/biquad`'s `cascade`/`filter`, or `digital-filter`'s
 * `filter()`), one cascade per band, low-to-high.
 *
 * LR order ≡ 2 (mod 4) — LR2, LR6, ... — needs one output inverted per crossover to sum
 * flat; order ≡ 0 (mod 4) — LR4, LR8, ... — sums in-phase already. That inversion is
 * applied internally to every other band, so the returned bands already sum flat when
 * added in the time domain (Linkwitz & Riley, JAES 24(1), 1976).
 *
 * @param frequencies Crossover frequencies, ascending, in Hz — N-1 frequencies for N bands.
 * @param order LR filter order: 2, 4, or 8 (two, four, or eight cascaded RBJ sections
 *   per crossover point via `digital-filter`'s Linkwitz-Riley design). Default 4.
 * @param fs Sample rate, Hz. Default 44100.
 * @returns One SOS array per band (low-to-high), each ready for a biquad cascade.
 */
export default function crossover(frequencies: number[], order?: number, fs?: number): SOSSection[][]
