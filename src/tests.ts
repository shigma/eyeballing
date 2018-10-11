import * as Palette from './palette'
import * as Vector from './vector'

interface EyeballingTest<T extends object = Record<string, any>> {
  name: string
  dataset: T[]
  caption: string
  init?(this: typeof Text, data: T): void
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
}, {
  name: 'bisect',
  caption: 'Bisect the angle.',
  dataset: [{
    p0: { x: 100, y: 280 },
    p1: { x: 60, y: 120 },
    p2: { x: 240, y: 160 },
  }],
  base({ p0, p1, p2 }) {
    this.segment(p0, p1)
    this.segment(p0, p2)
    this.point(p0)
  },
  draw({ p0 }, mouse) {
    this.halfline(p0, mouse)
  },
  test({ p0, p1, p2 }, mouse) {
    const d1 = Vector.distance(p0, p1)
    const d2 = Vector.distance(p0, p2)
    const target = Vector.division(p1, p2, d2, d1)
    this.halfline(p0, target)
    return Math.abs(Vector.angle(p0, target, mouse)) * Math.sqrt(d1 * d2)
  },
}, {
  name: 'parallelogram',
  caption: 'Adjust to make a parallelogram.',
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
}, {
  name: 'circle-center',
  caption: 'Mark the center of the circle.',
  dataset: [{
    o: { x: 130, y: 220 },
    r: 70,
  }],
  base({ o, r }) {
    this.circle(o, r)
  },
  draw(data, mouse) {
    this.point(mouse)
  },
  test({ o }, mouse) {
    this.point(o)
    return Vector.distance(o, mouse)
  },
}, {
  name: 'barycenter',
  caption: 'Mark the barycenter of the triangle.',
  dataset: [{
    p1: { x: 80, y: 220 },
    p2: { x: 230, y: 200 },
    p3: { x: 200, y: 100 },
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
}, {
  name: 'right-angle',
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
}, {
  name: 'convergence',
  caption: 'Find the point of convergence.',
  dataset: [{
    p0: { x: 200, y: 300 },
    s1: { x: 5, y: -30 },
    s2: { x: -25, y: -20 },
    s3: { x: -16, y: -8 },
    r1: [ 3, 6 ],
    r2: [ 3, 7 ],
    r3: [ 5, 11 ],
  }],
  init(data) {
    data.p11 = Vector.plus(data.p0, Vector.times(data.s1, data.r1[0]))
    data.p12 = Vector.plus(data.p0, Vector.times(data.s1, data.r1[1]))
    data.p21 = Vector.plus(data.p0, Vector.times(data.s2, data.r2[0]))
    data.p22 = Vector.plus(data.p0, Vector.times(data.s2, data.r2[1]))
    data.p31 = Vector.plus(data.p0, Vector.times(data.s3, data.r3[0]))
    data.p32 = Vector.plus(data.p0, Vector.times(data.s3, data.r3[1]))
  },
  base({ p11, p12, p21, p22, p31, p32 }) {
    this.segment(p11, p12)
    this.segment(p21, p22)
    this.segment(p31, p32)
  },
  draw({ p11, p21, p31 }, mouse) {
    this.point(mouse)
    this.segment(p11, mouse)
    this.segment(p21, mouse)
    this.segment(p31, mouse)
  },
  test({ p11, p21, p31, p0 }, mouse) {
    this.point(p0)
    this.segment(p11, p0)
    this.segment(p21, p0)
    this.segment(p31, p0)
    return Vector.distance(p0, mouse)
  }
}, {
  name: 'tangent',
  caption: 'Draw a tangent line from the given point.',
  dataset: [{
    o: { x: 180, y: 220 },
    p: { x: 70, y: 70 },
    r: 80,
  }],
  base({ o, p, r }) {
    this.circle(o, r)
    this.point(p)
  },
  draw({ p }, mouse) {
    this.halfline(p, mouse)
  },
  test({ o, p, r }, mouse) {
    const diff = Vector.minus(p, o)
    const sdist = Vector.squareDist(p, o)
    const angle = Vector.angle(p, o, mouse)
    const alpha = Math.asin(r / Math.sqrt(sdist))
    const power = Math.sqrt(sdist - r ** 2) * (Math.sign(angle) || 1)
    const target = {
      x: (r * (diff.x) - power * Math.abs(diff.y)) * r / sdist + o.x,
      y: (r * (diff.y) + power * Math.abs(diff.x)) * r / sdist + o.y,
    }
    this.point(target)
    this.halfline(p, target)
    return Math.abs(Math.abs(angle) - alpha) * Math.sqrt(sdist)
  }
}]

export default tests
