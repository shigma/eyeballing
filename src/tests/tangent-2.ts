import * as Vector from '../vector'
import { Eyeballing } from '../tests'
import Bezier from '../data/bezier'

export default {
  name: '切线 2',
  caption: '作出曲线在给定点处的切线。',
  dataset: [
    { ...Bezier[0], t: 0.5 },
    { ...Bezier[1], t: 0.4 },
  ],
  init(data) {
    data.c = new Vector.Bezier(data.p1, data.p2, data.p3, data.p4)
    data.p = data.c.r(data.t)
  },
  base({ c, p }) {
    this.bezier(c)
    this.point(p)
  },
  draw({ p }, mouse) {
    this.line(p, mouse)
  },
  test({ p, c, t, p1, p4 }, mouse) {
    const q = Vector.plus(p, c.r1(t))
    this.line(p, q)
    return Vector.acuteAngle(p, q, mouse) * Vector.distance(p1, p4)
  }
} as Eyeballing
