import * as Vector from '../vector'
import { Eyeballing } from '../tests'

export default {
  name: 'tangent 2',
  caption: 'Find the tangent to the curve from the given point.',
  dataset: [{
    p1: { x: 80, y: 120 },
    p2: { x: 180, y: 100 },
    p3: { x: 160, y: 220 },
    p4: { x: 240, y: 240 },
    t: 0.5,
  }],
  init(data) {
    data.p = Vector.linearSum(
      [data.p1, (1 - data.t) ** 3],
      [data.p2, 3 * data.t * (1 - data.t) ** 2],
      [data.p3, 3 * data.t ** 2 * (1 - data.t)],
      [data.p4, data.t ** 3],
    )
    data.t = Vector.linearSum(
      [data.p],
      [data.p1, 0 - (1 - data.t) ** 2],
      [data.p2, (1 - 3 * data.t) * (1 - data.t)],
      [data.p3, data.t * (2 - 3 * data.t)],
      [data.p4, data.t ** 2],
    )
  },
  base({ p1, p2, p3, p4, p }) {
    this.bezier(p1, p2, p3, p4)
    this.point(p)
  },
  draw({ p }, mouse) {
    this.line(p, mouse)
  },
  test({ t, p, p1, p4 }, mouse) {
    this.line(p, t)
    const angle = Vector.angle(p, t, mouse)
    return Math.abs(angle) * Vector.distance(p1, p4)
  }
} as Eyeballing
