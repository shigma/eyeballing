import { Point, Line } from './palette'

type PointLike1 = Point | [Line, Line]
type LineLike1 = Line | [Point, Point]
type PointLike2 = Point | [LineLike1, LineLike1]
type LineLike2 = Line | [PointLike1, PointLike1]
export type PointLike = Point | [LineLike2, LineLike2]
export type LineLike = Line | [PointLike2, PointLike2]

export function squareDist(p1: Point, p2: Point): number {
  return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2
}

export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(squareDist(p1, p2))
}

export function angle(p0: Point, p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p0.y, p2.x - p0.x) - Math.atan2(p1.y - p0.y, p1.x - p0.x)
}

export function dot(p1: Point, p2: Point): number {
  return p1.x * p2.x + p1.y * p2.y
}

export function cross(p1: Point, p2: Point): number {
  return p1.x * p2.y - p1.y * p2.x
}

export function area(p1: Point, p2: Point, p3: Point): number {
  return cross(minus(p3, p1), minus(p2, p1)) / 2
}

export function plus(p1: Point, p2: Point): Point {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  }
}

export function minus(p1: Point, p2: Point): Point {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
  }
}

export function times(p: Point, r: number): Point {
  return {
    x: p.x * r,
    y: p.y * r,
  }
}

export function center(...pp: Point[]): Point {
  const { length } = pp
  const p0 = pp.shift()
  const sum = pp.reduce(plus, p0)
  return {
    x: sum.x / length,
    y: sum.y / length,
  }
}

export function division(p1: Point, p2: Point, port1 = 1, port2 = 1): Point {
  const sum = port1 + port2
  return {
    x: (p1.x * port1 + p2.x * port2) / sum,
    y: (p1.y * port1 + p2.y * port2) / sum,
  }
}

export function connect(p1: PointLike, p2: PointLike): Line {
  if (p1 instanceof Array) p1 = intersect(...p1)
  if (p2 instanceof Array) p2 = intersect(...p2)
  const k = (p2.y - p1.y) / (p2.x - p1.x)
  return { ...p1, k, b: p1.y - k * p1.x }
}

export function intersect(l1: LineLike, l2: LineLike): Point {
  if (l1 instanceof Array) l1 = connect(...l1)
  if (l2 instanceof Array) l2 = connect(...l2)
  const diff = l2.k - l1.k
  return {
    x: (l1.b - l2.b) / diff,
    y: (l2.k * l1.b - l1.k * l2.b) / diff,
  }
}
