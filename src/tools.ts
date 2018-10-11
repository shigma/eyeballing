export default {
  segment(x1, y1, x2, y2, color = 'black', width = 2) {
    this.strokeStyle = color
    this.lineWidth = width
    this.beginPath()
    this.moveTo(x1, y1)
    this.lineTo(x2, y2)
    this.stroke()
  },
  halfline(x1, y1, x2, y2, color = 'black', width = 2) {
    this.strokeStyle = color
    this.lineWidth = width
    this.beginPath()
    this.moveTo(x1, y1)
    let x3: number, y3: number
    if (x1 === x2) {
      x3 = x1
      y3 = y1 > y2 ? 0 : 400
    } else {
      x3 = x1 > x2 ? 0 : 300
      y3 = (x2 * y1 + x3 * y2 - x1 * y2 - x3 * y1) / (x2 - x1)
    }
    this.lineTo(x3, y3)
    this.stroke()
  },
  point(x, y, bdColor = 'red', bgColor = 'white', radius = 3, width = 1) {
    this.fillStyle = bgColor
    this.beginPath()
    this.arc(x, y, radius, 0, 2 * Math.PI)
    this.fill()
    this.lineWidth = width
    this.strokeStyle = bdColor
    this.beginPath()
    this.arc(x, y, radius, 0, 2 * Math.PI)
    this.stroke()
  },
}
