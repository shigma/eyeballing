import * as Vector from '../vector'
import { Eyeballing } from '../tests'

export default {
  name: 'right angle',
  caption: 'Make a right angle.',
  dataset: [{
    p0: { x: 100, y: 120 },
    p1: { x: 120, y: 280 },
  }],
  base({ p1, p0 }) {
    this.point(p0)
    this.segment(p0, p1)
  },
  draw({ p0 }, mouse) {
    this.halfline(p0, mouse)
  },
  test({ p0, p1 }, mouse) {
    const diff = Vector.minus(p1, p0)
    const angle = Vector.angle(p0, p1, mouse)
    this.halfline(p0, {
      x: p0.x - diff.y * (Math.sign(angle) || 1),
      y: p0.y + diff.x * (Math.sign(angle) || 1),
    })
    return Math.abs(Math.abs(angle) - Math.PI / 2) * Vector.distance(p0, p1)
  }
} as Eyeballing
