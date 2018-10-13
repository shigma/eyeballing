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
import circumcenter from './tests/circumcenter'
import convergence from './tests/convergence'
import curvatureCircle1 from './tests/curvature-circle-1'
import curvatureCircle2 from './tests/curvature-circle-2'
import incenter from './tests/incenter'
import midpoint from './tests/midpoint'
import orthocenter from './tests/orthocenter'
import parallelogram from './tests/parallelogram'
import rightAngle from './tests/right-angle'
import tangent1 from './tests/tangent-1'
import tangent2 from './tests/tangent-2'

export const allItems = [
  barycenter,
  bisector,
  circleCenter,
  circumcenter,
  convergence,
  curvatureCircle1,
  curvatureCircle2,
  incenter,
  midpoint,
  orthocenter,
  parallelogram,
  rightAngle,
  tangent1,
  tangent2,
]

export const testItems = [
  midpoint,
  circleCenter,
  barycenter,
  incenter,
  orthocenter,
  convergence,
  tangent2,
  curvatureCircle1,
  curvatureCircle2,
]
