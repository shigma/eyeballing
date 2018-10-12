import * as Palette from './palette'
import { Point } from './vector'

export interface Eyeballing<T extends object = Record<string, any>> {
  name: string
  dataset: T[]
  caption: string
  init?(this: typeof Text, data: T): void
  base?(this: typeof Palette, data: T): void
  draw?(this: typeof Palette, data: T, mouse: Point): void
  test?(this: typeof Palette, data: T, mouse: Point): number
}

import barycenter from './tests/barycenter'
import bisector from './tests/bisector'
import circleCenter from './tests/circle-center'
import circleTangent from './tests/circle-tangent'
import convergence from './tests/convergence'
import curvatureCircle from './tests/curvature-circle'
import curveTangent from './tests/curve-tangent'
import midpoint from './tests/midpoint'
import parallelogram from './tests/parallelogram'
import rightAngle from './tests/right-angle'

export const tests = [
  barycenter,
  bisector,
  circleCenter,
  circleTangent,
  convergence,
  curvatureCircle,
  curveTangent,
  midpoint,
  parallelogram,
  rightAngle,
]
