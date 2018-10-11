export interface Point {
  x: number
  y: number
}

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

function lineStrokeStyle(agent: string): string {
  switch(agent) {
    case 'user': return 'dimgray'
    case 'test': return 'forestgreen'
    case 'base': return 'black'
  }
}

function pointStrokeStyle(agent: string): string {
  switch(agent) {
    case 'user': return 'blue'
    case 'test': return 'green'
    case 'base': return 'red'
  }
}

export function segment(p1: Point, p2: Point): void {
  this.strokeStyle = lineStrokeStyle(this.$agent)
  this.beginPath()
  this.moveTo(p1.x, p1.y)
  this.lineTo(p2.x, p2.y)
  this.stroke()
}

export function halfline(p1: Point, p2: Point): void {
  this.strokeStyle = lineStrokeStyle(this.$agent)
  this.beginPath()
  this.moveTo(p1.x, p1.y)
  let x3: number, y3: number
  if (p1.x === p2.x) {
    x3 = p1.x
    y3 = p1.y > p2.y ? 0 : 400
  } else {
    x3 = p1.x > p2.x ? 0 : 300
    y3 = (p2.x * p1.y + x3 * p2.y - p1.x * p2.y - x3 * p1.y) / (p2.x - p1.x)
  }
  this.lineTo(x3, y3)
  this.stroke()
}

export function line(p1: Point, p2: Point): void {
  this.strokeStyle = lineStrokeStyle(this.$agent)
  this.beginPath()
  if (p1.x === p2.x) {
    this.moveTo(p1.x, 0)
    this.lineTo(p2.x, 400)
  } else {
    this.moveTo(0, (p2.x * p1.y - p1.x * p2.y) / (p2.x - p1.x))
    this.lineTo(300, (p2.x * p1.y + 300 * p2.y - p1.x * p2.y - 300 * p1.y) / (p2.x - p1.x))
  }
  this.stroke()
}

export function point(p: Point): void {
  const bdColor = pointStrokeStyle(this.$agent)
  this.$points.push(() => {
    this.strokeStyle = bdColor
    this.beginPath()
    this.arc(p.x, p.y, 3, 0, 2 * Math.PI)
    this.fill()
    this.stroke()
  })
}
