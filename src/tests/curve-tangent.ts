import * as Vector from '../vector'
import { Eyeballing } from '../tests'

export default {
  name: '曲线的切线',
  caption: '作出曲线在给定点处的切线。',
  dataset: [{
    p1: { x: 80, y: 120 },
    p2: { x: 180, y: 100 },
    p3: { x: 160, y: 220 },
    p4: { x: 240, y: 240 },
    t: 0.5,
  }],
  init(data) {
    data.c = new Vector.Bezier(data.p1, data.p2, data.p3, data.p4)
    data.p = data.c.r(data.t)
    data.q = Vector.plus(data.p, data.c.r1(data.t))
  },
  base({ c, p }) {
    this.bezier(c)
    this.point(p)
  },
  draw({ p }, mouse) {
    this.line(p, mouse)
  },
  test({ q, p, p1, p4 }, mouse) {
    this.line(p, q)
    const angle = Vector.angle(p, q, mouse)
    return Math.abs(angle) * Vector.distance(p1, p4)
  }
} as Eyeballing
