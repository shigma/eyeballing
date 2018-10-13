import * as Vector from '../vector'
import { Eyeballing } from '../tests'
import Bezier from '../data/bezier'

export default {
  name: '曲率圆 1',
  caption: '画出曲线在给定点处你认为<strong>最贴合</strong>曲线的圆。',
  dataset: [
    { ...Bezier[0], t: 0.3 },
    { ...Bezier[1], t: 0.3 },
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
    this.point(mouse)
    this.circle(mouse, Vector.distance(p, mouse))
  },
  test({ c, t, p }, mouse) {
    const r1 = c.r1(t)
    const r2 = c.r2(t)
    const dir = Math.sign(Vector.cross(r1, r2)) || 1
    const target = Vector.plus(p, Vector.normalize(
      Vector.rotate(Vector.origin, r1, Math.PI / 2 * dir),
      Vector.distance(r1) ** 3 / Math.abs(Vector.cross(r1, r2)),
    ))
    this.point(target)
    this.circle(target, Vector.distance(p, target))
    return Vector.distance(target, mouse)
  }
} as Eyeballing
