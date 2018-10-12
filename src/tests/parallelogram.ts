import * as Vector from '../vector'
import { Eyeballing } from '../tests'

export default {
  name: '平行四边形',
  caption: '标出形成平行四边形的最后一个点。',
  dataset: [{
    p0: { x: 180, y: 80 },
    p1: { x: 60, y: 120 },
    p2: { x: 220, y: 160 },
  }],
  base({ p0, p1, p2 }) {
    this.segment(p1, p0)
    this.segment(p2, p0)
    this.point(p0)
    this.point(p1)
    this.point(p2)
  },
  draw({ p1, p2 }, mouse) {
    this.segment(p1, mouse)
    this.segment(p2, mouse)
    this.point(mouse)
  },
  test({ p0, p1, p2 }, mouse) {
    const target = Vector.minus(Vector.plus(p1, p2), p0)
    this.segment(p1, target)
    this.segment(p2, target)
    this.point(target)
    return Vector.distance(target, mouse)
  },
} as Eyeballing
