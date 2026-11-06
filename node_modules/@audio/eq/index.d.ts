// Keep the umbrella API identical to its leaf exports.
export { default as graphicEq } from '@audio/eq-graphic'
export { default as parametricEq } from '@audio/eq-parametric'
export { default as crossover } from '@audio/eq-crossover'
export { default as lowShelf } from '@audio/eq-lowshelf'
export { default as highShelf } from '@audio/eq-highshelf'
export { default as baxandall } from '@audio/eq-baxandall'
export { default as tilt } from '@audio/eq-tilt'
export { default as firEq, design as firDesign } from '@audio/eq-fir'
export { default as dynamicEq } from '@audio/eq-dynamic'
export { default as fitEq, toEqualizerApo, fromEqualizerApo, response as eqResponse } from '@audio/eq-fit'

export type { SOSSection } from '@audio/eq-crossover'
export type { DynamicBand, DynamicEqParams } from '@audio/eq-dynamic'
export type { FirResponsePoint, FirDesignOptions, FirEqOptions } from '@audio/eq-fir'
export type { FitBand, FitTargetPoint, FitTargetCurve, FitTarget, FitOptions, FitResult } from '@audio/eq-fit'
export type { HighShelfParams } from '@audio/eq-highshelf'
export type { LowShelfParams } from '@audio/eq-lowshelf'
export type { ParametricBand } from '@audio/eq-parametric'

// Retain the existing umbrella option names for consumers.
import type { GraphicEqParams as GraphicEqParamsBase } from '@audio/eq-graphic'
export interface GraphicEqParams extends GraphicEqParamsBase { [key: string]: unknown }
import type { ParametricEqParams as ParametricEqParamsBase } from '@audio/eq-parametric'
export interface ParametricEqParams extends ParametricEqParamsBase { [key: string]: unknown }
import type { BaxandallParams as BaxandallParamsBase } from '@audio/eq-baxandall'
export interface BaxandallParams extends BaxandallParamsBase { [key: string]: unknown }
import type { TiltParams as TiltParamsBase } from '@audio/eq-tilt'
export interface TiltParams extends TiltParamsBase { [key: string]: unknown }
export type { ParametricBand as PeqBand } from '@audio/eq-parametric'
import type { LowShelfParams } from '@audio/eq-lowshelf'
export interface ShelfParams extends LowShelfParams { [key: string]: unknown }
