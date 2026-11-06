/** One band of a parametric EQ. */
export interface ParametricBand {
  /** band center/corner frequency, Hz */
  fc: number
  /**
   * Q — bandwidth for `'peak'` (default 1), shelf slope for `'lowshelf'`/`'highshelf'`
   * (default 0.707). Omit for the type's default.
   */
  Q?: number
  /** band gain, dB (positive boosts, negative cuts). Default 0 */
  gain?: number
  /** band type. Default `'peak'` */
  type?: 'peak' | 'lowshelf' | 'highshelf'
}

/** N-band parametric EQ parameters. */
export interface ParametricEqParams {
  /** bands, applied in array order */
  bands?: ParametricBand[]
  /** sample rate, Hz. Default 44100 */
  fs?: number
}

/**
 * Apply an N-band parametric EQ in place — one RBJ biquad per band (peaking, low-shelf,
 * or high-shelf per `band.type`), cascaded in `bands` order.
 *
 * `params` doubles as persisted state: the filter cascade is cached on `params`; a change of
 * any band's `fc`/`Q`/`gain`/`type` or `fs` (compared by value, not reference) rebuilds only
 * the coefficients and each band's state carries over, so passing the *same* params object
 * across successive calls carries filter state across block boundaries automatically and
 * automation is click-free.
 */
export default function parametricEq<T extends number[] | Float32Array | Float64Array>(data: T, params: ParametricEqParams): T
