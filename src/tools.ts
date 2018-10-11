export interface Point {
  x: number
  y: number
}

export function segment(p1: Point, p2: Point) {
  this.strokeStyle = this.$userRelated ? 'dimgray' : 'black'
  this.beginPath()
  this.moveTo(p1.x, p1.y)
  this.lineTo(p2.x, p2.y)
  this.stroke()
}

export function halfline(p1: Point, p2: Point) {
  this.strokeStyle = this.$userRelated ? 'dimgray' : 'black'
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

export function line(p1: Point, p2: Point) {
  this.strokeStyle = this.$userRelated ? 'dimgray' : 'black'
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

export function point(p: Point) {
  const bdColor = this.$userRelated ? 'blue' : 'red'
  this.$points.push(() => {
    this.strokeStyle = bdColor
    this.beginPath()
    this.arc(p.x, p.y, 3, 0, 2 * Math.PI)
    this.fill()
    this.stroke()
  })
}
