import * as Vector from '../vector'
import { Eyeballing } from '../tests'
import Triangle from '../data/triangle'

export default {
  name: '内心',
  caption: '标出三角形的内心。\n内心是三角形<strong>三条角平分线的交点</strong>。',
  dataset: Triangle,
  base({ p1, p2, p3 }) {
    this.point(p1)
    this.point(p2)
    this.point(p3)
    this.segment(p1, p2)
    this.segment(p2, p3)
    this.segment(p3, p1)
  },
  draw({ p1, p2, p3 }, mouse) {
    this.point(mouse)
    this.segment(p1, mouse, 1)
    this.segment(p2, mouse, 1)
    this.segment(p3, mouse, 1)
  },
  test({ p1, p2, p3 }, mouse) {
    const s1 = Vector.distance(p2, p3)
    const s2 = Vector.distance(p3, p1)
    const s3 = Vector.distance(p1, p2)
    const q1 = Vector.division(p2, p3, s2, s3)
    const q2 = Vector.division(p3, p1, s3, s1)
    const target = Vector.intersect([p1, q1], [p2, q2])
    this.segment(p1, target, 1)
    this.segment(p2, target, 1)
    this.segment(p3, target, 1)
    this.point(target)
    return Vector.distance(target, mouse)
  },
} as Eyeballing
