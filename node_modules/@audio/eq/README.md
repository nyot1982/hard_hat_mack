# @audio/eq

Equalization and tone shaping for mono PCM in Node.js and browsers. Import named functions from the umbrella, or install a leaf package for one processor. Both imports use the same implementation and types.

```sh
npm install @audio/eq
```

```js
import { parametricEq } from '@audio/eq'

const fs = 48000
const input = new Float32Array(512)
input[0] = 1 // impulse; replace with your mono PCM samples
const params = { bands: [{ fc: 1000, Q: 1, gain: -6 }], fs }
const output = parametricEq(input.slice(), params)
console.log(output.length) // 512; input is preserved because we passed a copy
```

For the same operation from a leaf: `npm install @audio/eq-parametric`, then `import parametricEq from '@audio/eq-parametric'`. TypeScript declarations ship with both packages.

## API

| Umbrella export | Leaf / detailed options | Input → output and state |
|---|---|---|
| `lowShelf`, `highShelf` | [eq-lowshelf](https://github.com/audiojs/eq/blob/main/packages/eq-lowshelf/README.md), [eq-highshelf](https://github.com/audiojs/eq/blob/main/packages/eq-highshelf/README.md) | PCM + params → same buffer; reuse params for successive chunks |
| `parametricEq` | [eq-parametric](https://github.com/audiojs/eq/blob/main/packages/eq-parametric/README.md) | PCM + `{ bands, fs }` → same buffer; reuse params for successive chunks |
| `graphicEq` | [eq-graphic](https://github.com/audiojs/eq/blob/main/packages/eq-graphic/README.md) | PCM + `{ gains, fs }` → same buffer; reuse params for successive chunks |
| `baxandall` | [eq-baxandall](https://github.com/audiojs/eq/blob/main/packages/eq-baxandall/README.md) | PCM + bass/treble params → same buffer; reuse params for successive chunks |
| `tilt` | [eq-tilt](https://github.com/audiojs/eq/blob/main/packages/eq-tilt/README.md) | PCM + `{ gain, pivot, fs }` → same buffer; reuse params for successive chunks |
| `crossover` | [eq-crossover](https://github.com/audiojs/eq/blob/main/packages/eq-crossover/README.md) | Hz crossover points + order + fs → per-band SOS coefficients; does not process audio |
| `firEq`, `firDesign` | [eq-fir](https://github.com/audiojs/eq/blob/main/packages/eq-fir/README.md) | `firDesign(response, opts)` → coefficients; `firEq(data, opts)` → same buffer, whole-buffer processing |
| `dynamicEq` | [eq-dynamic](https://github.com/audiojs/eq/blob/main/packages/eq-dynamic/README.md) | PCM + band params → same buffer, whole-buffer processing |
| `fitEq`, `eqResponse`, `toEqualizerApo`, `fromEqualizerApo` | [eq-fit](https://github.com/audiojs/eq/blob/main/packages/eq-fit/README.md) | Curve fitting, response evaluation and text interchange; do not process audio |

Most leaves export their processor as default. The FIR leaf's named `design` is `firDesign` here; the fit leaf's default `fit` and named `response` become `fitEq` and `eqResponse`.

## Processing expectations

- Frequencies and `fs` are Hz; `fs` defaults to 44100. Gains are dB. Dynamic-EQ attack/release are milliseconds. Use each leaf's options for Q versus shelf-slope conventions.
- Shelves, parametric, graphic, Baxandall and tilt accept `Float32Array`, `Float64Array` or `number[]`. Their params object is required even when empty. They mutate the supplied buffer and return that exact reference, preserving its array type.
- These stateful filters store coefficients and history on params. Keep one params object per channel/instance and reuse it across chunks. Use a fresh object to reset. Parameter changes rebuild the affected filters; they are not automatically smoothed for live modulation.
- `firEq` accepts typed arrays and compensates FIR group delay by reading ahead within the whole buffer, with zero-padded edges. `dynamicEq` takes `Float32Array` and starts its detector/filter state fresh each call. Neither function preserves history between chunks.
- `fitEq` returns bands, fit error and a suggested preamp. Apply that preamp separately when processing the bands; `parametricEq` does not apply it. Check resulting peaks: a magnitude-response headroom estimate does not guarantee a time-domain peak ceiling.

To process successive chunks with the example's EQ, call `parametricEq(chunk, params)` for each chunk. To preserve each original, pass `chunk.slice()`. Do not share that params object between left and right channels.

The `/audio` exports available on some leaves are host processor factories, a separate API from these buffer functions. Consult their parameter metadata for restart and streaming limits; a buffer function's existence does not establish AudioWorklet or native-plugin support.

Extracted from [filter](https://github.com/audiojs/filter). Headphone crossfeed lives in `@audio/spatial-crossfeed`.
