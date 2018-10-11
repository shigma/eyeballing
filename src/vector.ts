import { Point } from './palette'

export function squareDist(p1: Point, p2: Point): number {
  return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2
}

export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(squareDist(p1, p2))
}

export function angle(p0: Point, p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p0.y, p2.x - p0.x) - Math.atan2(p1.y - p0.y, p1.x - p0.x)
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

export function division(p1: Point, p2: Point, port1 = 1, port2 = 1): Point {
  return {
    x: (p1.x * port1 + p2.x * port2) / (port1 + port2),
    y: (p1.y * port1 + p2.y * port2) / (port1 + port2),
  }
}
