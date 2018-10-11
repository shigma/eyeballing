import * as Palette from './palette'
import * as Vector from './vector'

interface EyeballingTest<T extends object = Record<string, any>> {
  name: string
  dataset: T[]
  caption: string
  base?(this: typeof Palette, data: T): void
  draw?(this: typeof Palette, data: T, mouse: Palette.Point): void
  test?(this: typeof Palette, data: T, mouse: Palette.Point): number
}

const tests: EyeballingTest[] = [{
  name: 'midpoint',
  caption: 'Find the midpoint of the line segment.',
  dataset: [{
    p1: { x: 200, y: 100 },
    p2: { x: 100, y: 260 },
  }],
  base(data) {
    this.point(data.p1)
    this.point(data.p2)
  },
  draw(data, mouse) {
    this.segment(mouse, data.p1)
    this.segment(mouse, data.p2)
    this.point(mouse)
  },
  test(data, mouse) {
    const target = Vector.division(data.p1, data.p2)
    this.segment(data.p1, data.p2)
    this.point(target)
    return Vector.distance(target, mouse)
  },
}, {
  name: 'bisect',
  caption: 'Bisect the angle.',
  dataset: [{
    p0: { x: 100, y: 280 },
    p1: { x: 60, y: 120 },
    p2: { x: 240, y: 160 },
  }],
  base(data) {
    this.segment(data.p0, data.p1)
    this.segment(data.p0, data.p2)
    this.point(data.p0)
  },
  draw(data, mouse) {
    this.halfline(data.p0, mouse)
  },
  test(data, mouse) {
    const d1 = Vector.distance(data.p0, data.p1)
    const d2 = Vector.distance(data.p0, data.p2)
    const target = Vector.division(data.p1, data.p2, d2, d1)
    this.halfline(data.p0, target)
    return Math.abs(Vector.angle(data.p0, target, mouse)) * Math.sqrt(d1 * d2)
  },
}, {
  name: 'parallelogram',
  caption: 'Adjust to make a parallelogram.',
  dataset: [{
    p0: { x: 180, y: 80 },
    p1: { x: 60, y: 120 },
    p2: { x: 220, y: 160 },
  }],
  base(data) {
    this.segment(data.p1, data.p0)
    this.segment(data.p2, data.p0)
    this.point(data.p0)
    this.point(data.p1)
    this.point(data.p2)
  },
  draw(data, mouse) {
    this.segment(data.p1, mouse)
    this.segment(data.p2, mouse)
    this.point(mouse)
  },
  test(data, mouse) {
    const target = Vector.minus(Vector.plus(data.p1, data.p2), data.p0)
    this.segment(data.p1, target)
    this.segment(data.p2, target)
    this.point(target)
    return Vector.distance(target, mouse)
  },
}, {
  name: 'circle-center',
  caption: 'Mark the center of the circle.',
  dataset: [{
    p: { x: 130, y: 220 },
    r: 70,
  }],
  base(data) {
    this.circle(data.p, data.r)
  },
  draw(data, mouse) {
    this.point(mouse)
  },
  test(data, mouse) {
    this.point(data.p)
    return Vector.distance(data.p, mouse)
  },
}]

export default tests
