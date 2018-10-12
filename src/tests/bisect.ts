import * as Vector from '../vector'
import { Eyeballing } from '../tests'

export default {
  name: 'bisect',
  caption: 'Bisect the angle.',
  dataset: [{
    p0: { x: 100, y: 280 },
    p1: { x: 60, y: 120 },
    p2: { x: 240, y: 160 },
  }],
  base({ p0, p1, p2 }) {
    this.segment(p0, p1)
    this.segment(p0, p2)
    this.point(p0)
  },
  draw({ p0 }, mouse) {
    this.halfline(p0, mouse)
  },
  test({ p0, p1, p2 }, mouse) {
    const d1 = Vector.distance(p0, p1)
    const d2 = Vector.distance(p0, p2)
    const target = Vector.division(p1, p2, d2, d1)
    this.halfline(p0, target)
    return Math.abs(Vector.angle(p0, target, mouse)) * Math.sqrt(d1 * d2)
  },
} as Eyeballing
