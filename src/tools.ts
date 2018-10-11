type DrawTool = (this: CanvasRenderingContext2D, ...args: any[]) => void

const tools: Record<string, DrawTool> = {
  segment(x1, y1, x2, y2, color = 'black') {
    this.strokeStyle = color
    this.beginPath()
    this.moveTo(x1, y1)
    this.lineTo(x2, y2)
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

export default tools
