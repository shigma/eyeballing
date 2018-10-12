import * as Vector from '../vector'
import { Eyeballing } from '../tests'

export default {
  name: '曲率圆',
  caption: '画出曲线在给定点处你认为<strong>最贴合</strong>曲线的圆。',
  dataset: [{
    p1: { x: 80, y: 120 },
    p2: { x: 180, y: 100 },
    p3: { x: 160, y: 220 },
    p4: { x: 240, y: 240 },
    t: 0.3,
  }],
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
    const target = Vector.plus(p, Vector.normalize(
      Vector.rotate(Vector.origin, r1, Math.PI / 2),
      Vector.distance(r1) ** 3 / Math.abs(Vector.cross(r1, r2)),
    ))
    this.point(Vector.plus(p, Vector.rotate(Vector.origin, r1, Math.PI / 2)))
    this.circle(target, Vector.distance(p, target))
    return Vector.distance(target, mouse)
  }
} as Eyeballing
