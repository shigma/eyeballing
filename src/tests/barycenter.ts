import * as Vector from '../vector'
import { Eyeballing } from '../tests'

export default {
  name: '重心',
  caption: '标出三角形的重心。\n重心是三角形<strong>三条中线的交点</strong>。',
  dataset: [{
    p1: { x: 80, y: 220 },
    p2: { x: 230, y: 200 },
    p3: { x: 200, y: 100 },
  }, {
    p1: { x: 100, y: 220 },
    p2: { x: 220, y: 200 },
    p3: { x: 60, y: 100 },
  }],
  init(data) {
    data.l1 = Vector.connect(data.p2, data.p3)
    data.l2 = Vector.connect(data.p3, data.p1)
    data.l3 = Vector.connect(data.p1, data.p2)
  },
  base({ p1, p2, p3 }) {
    this.segment(p1, p2)
    this.segment(p2, p3)
    this.segment(p3, p1)
    this.point(p1)
    this.point(p2)
    this.point(p3)
  },
  draw({ p1, p2, p3, l1, l2, l3 }, mouse) {
    this.point(mouse)
    const s1 = Vector.area(mouse, p2, p3)
    const s2 = Vector.area(mouse, p3, p1)
    const s3 = Vector.area(mouse, p1, p2)
    if (s1 > 0 && s2 > 0 && s3 > 0) {
      const q1 = Vector.intersect(l1, [p1, mouse])
      const q2 = Vector.intersect(l2, [p2, mouse])
      const q3 = Vector.intersect(l3, [p3, mouse])
      this.segment(p1, q1, 1)
      this.segment(p2, q2, 1)
      this.segment(p3, q3, 1)
      this.point(q1, 2)
      this.point(q2, 2)
      this.point(q3, 2)
    }
  },
  test({ p1, p2, p3 }, mouse) {
    const target = Vector.center(p1, p2, p3)
    const q1 = Vector.division(p2, p3)
    const q2 = Vector.division(p3, p1)
    const q3 = Vector.division(p1, p2)
    this.segment(p1, q1, 1)
    this.segment(p2, q2, 1)
    this.segment(p3, q3, 1)
    this.point(q1, 2)
    this.point(q2, 2)
    this.point(q3, 2)
    this.point(target)
    return Vector.distance(target, mouse)
  },
} as Eyeballing
