import DrawTools from './tools'

interface MousePosition {
  x: number
  y: number
}

interface EyeballingTest<T extends object = Record<string, any>> {
  name: string,
  dataset: T[],
  test(data: T): any,
  draw(
    ctx: CanvasRenderingContext2D & typeof DrawTools,
    data: T,
    mouse: MousePosition,
  ): void
}

const tests: EyeballingTest[] = [
  {
    name: 'midpoint',
    dataset: [
      {
        x1: 200,
        y1: 100,
        x2: 100,
        y2: 260,
      },
    ],
    test(data) {
      return {
        x: (data.x1 + data.x2) / 2,
        y: (data.y1 + data.y2) / 2
      }
    },
    draw(ctx, data, mouse) {
      ctx.clearRect(0, 0, 300, 400)
      ctx.lineCap = 'round'
      ctx.lineWidth = 2
      if (mouse) {
        ctx.segment(mouse.x, mouse.y, data.x1, data.y1)
        ctx.segment(mouse.x, mouse.y, data.x2, data.y2)
        ctx.point(mouse.x, mouse.y, 'blue')
      }
      ctx.point(data.x1, data.y1)
      ctx.point(data.x2, data.y2)
    }
  }
]

export default tests
