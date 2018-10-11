<script>

const tests = require('./tests').default
const tools = require('./tools')

module.exports = {
  data: () => ({
    mouse: null,
    index: 0,
    tools: {},
  }),

  mounted() {
    window.vm = this
    this._ctx = this.$refs.canvas.getContext('2d')
    this._ctx.lineCap = 'round'
    for (const key in tools) {
      this.tools[key] = tools[key].bind(this._ctx)
    }
    this.refresh()
  },

  methods: {
    refresh() {
      this._ctx.$points = []
      this._ctx.lineWidth = 2
      this._ctx.clearRect(0, 0, 300, 400)
      const test = tests[this.index]
      test.base.call(this.tools, test.dataset[0])
      if (this.mouse) {
        this._ctx.$userRelated = true
        test.draw.call(this.tools, test.dataset[0], this.mouse)
        this._ctx.$userRelated = false
      }
      this._ctx.lineWidth = 1
      this._ctx.fillStyle = 'white'
      this._ctx.$points.forEach(callback => callback.call(this._ctx))
    },
    onMousemove(event) {
      this.mouse = {
        x: event.offsetX,
        y: event.offsetY,
      }
      this.refresh()
    },
    onMouseleave() {
      this.mouse = null
      this.refresh()
    },
    nextTest() {
      this.index += 1
      this.index %= tests.length
      this.mouse = null
      this.refresh()
    },
  },
}

</script>

<template>
  <div>
    <div class="wrapper">
      <canvas height="400" width="300" ref="canvas"
        @mousemove="onMousemove" @mouseleave="onMouseleave"/>
      <div class="next" @click="nextTest">Next</div>
    </div>
    <div>{{ 233 }}</div>
  </div>
</template>

<style lang="scss" scoped>

& {
  top: 0;
  bottom: 0;
  margin: auto;
  display: table;
  position: absolute;
}

> * {
  position: relative;
  display: table-cell;
  vertical-align: middle;
}

> .wrapper {
  padding: 0 40px;

  > canvas {
    border: 1px solid;
    cursor: pointer;
  }

  > .next {
    transition: .3s ease;
    position: absolute;
    font-size: 16px;
    bottom: 12px;
    right: 50px;
    width: 48px;
    line-height: 1em;
    padding: 8px;
    text-align: center;
    border-radius: 8px;
    background-color: beige;
    user-select: none;
    cursor: pointer;

    &:hover {
      background-color: bisque;
    }
  }
}

</style>
