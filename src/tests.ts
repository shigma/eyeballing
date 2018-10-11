import * as DrawTools from './tools'

interface EyeballingTest<T extends object = Record<string, any>> {
  name: string
  dataset: T[]
  caption: string
  base?(this: typeof DrawTools, data: T): void
  draw?(this: typeof DrawTools, data: T, mouse: DrawTools.Point): void
  test?(this: typeof DrawTools, data: T, mouse: DrawTools.Point): number
}

const tests: EyeballingTest[] = [
  {
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
      const target = this.division(data.p1, data.p2)
      this.segment(data.p1, data.p2)
      this.point(target)
      return this.squareDist(target, mouse)
    },
  },
  {
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
      const d1 = this.distance(data.p0, data.p1)
      const d2 = this.distance(data.p0, data.p2)
      const target = this.division(data.p1, data.p2, d2, d1)
      this.halfline(data.p0, target)
      return Math.abs(this.angle(data.p0, target, mouse)) * Math.sqrt(d1 * d2)
    },
  },
  {
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
      const target = this.minus(this.plus(data.p1, data.p2), data.p0)
      this.segment(data.p1, target)
      this.segment(data.p2, target)
      this.point(target)
      return this.squareDist(target, mouse)
    },
  },
]

export default tests
