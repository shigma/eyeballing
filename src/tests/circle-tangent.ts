import * as Vector from '../vector'
import { Eyeballing } from '../tests'

export default {
  name: '圆的切线',
  caption: '作出圆在给定点处的切线。',
  dataset: [{
    o: { x: 180, y: 220 },
    r: 80,
    t: 2,
  }],
  init(data) {
    data.p = Vector.polar(data.r, data.t, data.o)
  },
  base({ o, p, r }) {
    this.circle(o, r)
    this.point(p)
  },
  draw({ p }, mouse) {
    this.line(p, mouse)
  },
  test({ o, p, r }, mouse) {
    this.line(p, Vector.rotate(p, o, Math.PI / 2))
    const angle = Vector.angle(p, o, mouse)
    return Math.abs(Math.abs(angle) - Math.PI / 2) * 2 * r
  }
} as Eyeballing
