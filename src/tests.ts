import * as Palette from './palette'

export interface Eyeballing<T extends object = Record<string, any>> {
  name: string
  dataset: T[]
  caption: string
  init?(this: typeof Text, data: T): void
  base?(this: typeof Palette, data: T): void
  draw?(this: typeof Palette, data: T, mouse: Palette.Point): void
  test?(this: typeof Palette, data: T, mouse: Palette.Point): number
}

import barycenter from './tests/barycenter'
import bisect from './tests/bisect'
import circleCenter from './tests/circle-center'
import convergence from './tests/convergence'
import midpoint from './tests/midpoint'
import parallelogram from './tests/parallelogram'
import rightAngle from './tests/right-angle'
import tangent from './tests/tangent'
import tangent2 from './tests/tangent-2'

export const tests = [
  barycenter,
  bisect,
  circleCenter,
  convergence,
  midpoint,
  parallelogram,
  rightAngle,
  tangent,
  tangent2,
]
