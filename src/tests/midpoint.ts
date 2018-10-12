import * as Vector from '../vector'
import { Eyeballing } from '../tests'

export default {
  name: '中点',
  caption: '标出给定两点的中点。',
  dataset: [{
    p1: { x: 200, y: 100 },
    p2: { x: 100, y: 260 },
  }],
  base({ p1, p2 }) {
    this.point(p1)
    this.point(p2)
  },
  draw({ p1, p2 }, mouse) {
    this.segment(mouse, p1)
    this.segment(mouse, p2)
    this.point(mouse)
  },
  test({ p1, p2 }, mouse) {
    const target = Vector.division(p1, p2)
    this.segment(p1, p2)
    this.point(target)
    return Vector.distance(target, mouse)
  },
} as Eyeballing
