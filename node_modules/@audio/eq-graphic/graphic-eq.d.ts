/** Graphic EQ parameters. */
export interface GraphicEqParams {
  /**
   * Per-band gain in dB, keyed by ISO 266 / IEC 61260 1/1-octave center frequency:
   * `31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000`. Keys may be given as the
   * exact Hz value or its rounded integer (e.g. `31.5` or `32`). Unlisted bands default
   * to 0 dB (the identity: a settled 0 dB band is skipped).
   */
  gains?: Record<number, number>
  /** sample rate, Hz. Default 44100 */
  fs?: number
}

/**
 * Apply a 10-band ISO graphic EQ in place — one RBJ peaking biquad per non-zero band
 * (Q 1.4), cascaded in ascending frequency order.
 *
 * `params` doubles as persisted state: the filter cascade is cached on `params`; a change of
 * `gains`/`fs` (compared by value, not reference) rebuilds only the coefficients and each
 * band's state carries over, so passing the *same* params object across successive calls
 * carries filter state across block boundaries automatically and automation is click-free.
 */
export default function graphicEq<T extends number[] | Float32Array | Float64Array>(data: T, params: GraphicEqParams): T
