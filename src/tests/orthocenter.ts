import * as Vector from '../vector'
import { Eyeballing } from '../tests'
import Triangle from '../data/triangle'

export default {
  name: '垂心',
  caption: '标出三角形的垂心。\n垂心是三角形<strong>三条垂线的交点</strong>。',
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
    const q1 = Vector.intersect([p2, p3], [p1, mouse])
    const q2 = Vector.intersect([p3, p1], [p2, mouse])
    const q3 = Vector.intersect([p1, p2], [p3, mouse])
    this.segmentBesides([p1, p2], q3, 1)
    this.segmentBesides([p2, p3], q1, 1)
    this.segmentBesides([p3, p1], q2, 1)
    this.segmentAmong([p1, q1, mouse], 1)
    this.segmentAmong([p2, q2, mouse], 1)
    this.segmentAmong([p3, q3, mouse], 1)
    this.point(q1, 2)
    this.point(q2, 2)
    this.point(q3, 2)
    this.point(mouse)
  },
  test({ p1, p2, p3 }, mouse) {
    const p12 = Vector.minus(p1, p2)
    const p23 = Vector.minus(p2, p3)
    const p31 = Vector.minus(p3, p1)
    const deno = Vector.crossSum(p1, p2, p3)
    const target = {
      x: -(p2.x * p3.x * p23.y + p3.x * p1.x * p31.y + p1.x * p2.x * p12.y - p12.y * p23.y * p31.y) / deno,
      y: (p2.y * p3.y * p23.x + p3.y * p1.y * p31.x + p1.y * p2.y * p12.x - p12.x * p23.x * p31.x) / deno,
    }
    const q1 = Vector.intersect([p2, p3], [p1, target])
    const q2 = Vector.intersect([p3, p1], [p2, target])
    const q3 = Vector.intersect([p1, p2], [p3, target])
    this.segmentBesides([p1, p2], q3, 1)
    this.segmentBesides([p2, p3], q1, 1)
    this.segmentBesides([p3, p1], q2, 1)
    this.segmentAmong([p1, q1, target], 1)
    this.segmentAmong([p2, q2, target], 1)
    this.segmentAmong([p3, q3, target], 1)
    this.point(q1, 2)
    this.point(q2, 2)
    this.point(q3, 2)
    this.point(target)
    return Vector.distance(target, mouse)
  },
} as Eyeballing
