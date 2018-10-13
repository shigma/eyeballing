import * as Vector from '../vector'
import { Eyeballing } from '../tests'
import Bezier from '../data/bezier'

export default {
  name: '曲率圆 2',
  caption: '将给定圆放置在你认为<strong>最贴合</strong>曲线的地方。',
  dataset: [
    { ...Bezier[0], t: 0.75 },
    { ...Bezier[1], t: 0.75 },
  ],
  init(data) {
    data.c = new Vector.Bezier(data.p1, data.p2, data.p3, data.p4)
    data.p = data.c.r(data.t)
    data.r1 = data.c.r1(data.t)
    data.r2 = data.c.r2(data.t)
    data.r = Vector.distance(data.r1) ** 3 / Math.abs(Vector.cross(data.r1, data.r2))
  },
  base({ c }) {
    this.bezier(c)
  },
  draw({ r }, mouse) {
    this.point(mouse)
    this.circle(mouse, r)
  },
  test({ p, r, r1, r2 }, mouse) {
    const target = Vector.plus(p, Vector.normalize(
      Vector.rotate(Vector.origin, r1, Math.PI / 2),
      r * (Math.sign(Vector.cross(r1, r2)) || 1),
    ))
    this.point(p)
    this.point(target)
    this.circle(target, r)
    return Vector.distance(target, mouse)
  }
} as Eyeballing
