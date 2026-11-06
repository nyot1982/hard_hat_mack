/** RBJ low-shelf filter — boost or cut below a corner frequency. */
export interface LowShelfParams {
  /** corner frequency, Hz. Default 200 */
  fc?: number
  /** shelf gain, dB (positive boosts, negative cuts). Default 0 */
  gain?: number
  /** shelf slope — 1 is the RBJ "shelf slope = 1" (steepest monotonic), lower is gentler. Default 0.707 */
  Q?: number
  /** sample rate, Hz. Default 44100 */
  fs?: number
}

/**
 * Apply an RBJ low-shelf biquad in place.
 *
 * `params` doubles as persisted state: coefficients and filter memory are cached on it; a
 * change of `fc`/`gain`/`Q`/`fs` rebuilds only the coefficients and the memory carries over,
 * so passing the *same* params object across successive calls carries filter state across
 * block boundaries automatically and automation is click-free.
 */
export default function lowShelf<T extends number[] | Float32Array | Float64Array>(data: T, params: LowShelfParams): T
