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
      if (mouse) {
        ctx.segment(mouse.x, mouse.y, data.x1, data.y1)
        ctx.segment(mouse.x, mouse.y, data.x2, data.y2)
        ctx.point(mouse.x, mouse.y, 'blue')
      }
      ctx.point(data.x1, data.y1)
      ctx.point(data.x2, data.y2)
    }
  },
  {
    name: 'bisect',
    dataset: [
      {
        x0: 100,
        y0: 280,
        x1: 60,
        y1: 120,
        x2: 240,
        y2: 160,
      }
    ],
    test() {},
    draw(ctx, data, mouse) {
      if (mouse) {
        ctx.halfline(data.x0, data.y0, mouse.x, mouse.y)
        ctx.point(mouse.x, mouse.y, 'blue')
      }
      ctx.segment(data.x0, data.y0, data.x1, data.y1)
      ctx.segment(data.x0, data.y0, data.x2, data.y2)
      ctx.point(data.x0, data.y0)
      ctx.point(data.x1, data.y1)
      ctx.point(data.x2, data.y2)
    }
  }
]

export default tests
