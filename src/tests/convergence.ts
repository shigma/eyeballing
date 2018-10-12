import * as Vector from '../vector'
import { Eyeballing } from '../tests'

export default {
  name: '交汇点',
  caption: '找出三条线的交汇点。',
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
    data.p11 = Vector.linearSum([data.p0], [data.s1, data.r1[0]])
    data.p12 = Vector.linearSum([data.p0], [data.s1, data.r1[1]])
    data.p21 = Vector.linearSum([data.p0], [data.s2, data.r2[0]])
    data.p22 = Vector.linearSum([data.p0], [data.s2, data.r2[1]])
    data.p31 = Vector.linearSum([data.p0], [data.s3, data.r3[0]])
    data.p32 = Vector.linearSum([data.p0], [data.s3, data.r3[1]])
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
} as Eyeballing
