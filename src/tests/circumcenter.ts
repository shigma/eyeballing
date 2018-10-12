import * as Vector from '../vector'
import { Eyeballing } from '../tests'

export default {
  name: '外心',
  caption: '标出三角形的外心。\n外心是<strong>到三角形三个顶点距离相等的点</strong>。',
  dataset: [{
    p1: { x: 80, y: 220 },
    p2: { x: 230, y: 200 },
    p3: { x: 200, y: 100 },
  }],
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
    const p12 = Vector.minus(p1, p2)
    const p23 = Vector.minus(p2, p3)
    const p31 = Vector.minus(p3, p1)
    const deno = - (Vector.cross(p1, p2) + Vector.cross(p2, p3) + Vector.cross(p3, p1)) * 2
    const target = {
      x: -(p1.x ** 2 * p23.y + p2.x ** 2 * p31.y + p3.x ** 2 * p12.y - p12.y * p23.y * p31.y) / deno,
      y: (p1.y ** 2 * p23.x + p2.y ** 2 * p31.x + p3.y ** 2 * p12.x - p12.x * p23.x * p31.x) / deno,
    }
    this.point(target)
    this.segment(p1, target, 1)
    this.segment(p2, target, 1)
    this.segment(p3, target, 1)
    this.circle(target, p1)
    return Vector.distance(target, mouse)
  },
} as Eyeballing
