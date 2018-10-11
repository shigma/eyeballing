<script>

const tests = require('./tests')
const tools = require('./tools')

module.exports = {
  data: () => ({
    data: null,
    mouse: null,
  }),

  mounted() {
    window.vm = this
    this._ctx = this.$refs.canvas.getContext('2d')
    for (const key in tools) {
      this._ctx[key] = tools[key].bind(this._ctx)
    }
    this.refresh()
  },

  methods: {
    refresh() {
      tests[0].draw.call(this, this._ctx, tests[0].dataset[0], this.mouse)
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
  },
}

</script>

<template>
  <div>
    <div class="wrapper">
      <canvas height="400" width="300" ref="canvas"
        @mousemove="onMousemove" @mouseleave="onMouseleave"/>
      <div class="next">Next</div>
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
    cursor: pointer;

    &:hover {
      background-color: bisque;
    }
  }
}

</style>
