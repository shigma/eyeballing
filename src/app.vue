<script>

const tests = require('./tests').default
const tools = require('./tools').default

module.exports = {
  data: () => ({
    mouse: null,
    index: 0,
  }),

  mounted() {
    window.vm = this
    this._ctx = this.$refs.canvas.getContext('2d')
    this._ctx.lineCap = 'round'
    for (const key in tools) {
      this._ctx[key] = tools[key].bind(this._ctx)
    }
    this.refresh()
  },

  methods: {
    refresh() {
      this._ctx.clearRect(0, 0, 300, 400)
      const test = tests[this.index]
      test.draw.call(this, this._ctx, test.dataset[0], this.mouse)
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
