<script>

const tests = require('./tests').default
const tools = require('./palette')

const VERSION = '1.0'

module.exports = {
  data: () => ({
    tests,
    status: 0,
    mouse: null,
    index: 0,
    tools: {},
    results: [
      new Array(tests.length)
    ],
  }),

  computed: {
    test() {
      return this.tests[this.index]
    },
    title() {
      return this.test.name
        .replace(/^\w|-\w/g, str => str.toUpperCase())
        .replace(/-/g, ' ')
    },
    data() {
      const dataset = this.test.dataset
      return dataset[this.round % dataset.length]
    },
    round() {
      return this.results.length - 1
    },
    result() {
      return this.results[this.round]
    },
  },

  created() {
    let storage
    try {
      storage = JSON.parse(localStorage.getItem('shigma.eyeballing'))
    } catch (error) { null }
    if (storage && storage.version === VERSION) {
      this.results = storage.results
      this.index = storage.current
    }
  },

  mounted() {
    window.vm = this
    this._ctx = this.$refs.canvas.getContext('2d')
    this._ctx.lineCap = 'round'
    for (const key in tools) {
      this.tools[key] = tools[key].bind(this._ctx)
    }
    this.refresh()

    addEventListener('beforeunload', () => {
      if (this.status) this.nextTest()
      localStorage.setItem('shigma.eyeballing', JSON.stringify({
        results: this.results,
        current: this.index,
        version: VERSION,
      }))
    })
  },

  methods: {
    refresh() {
      this._ctx.$agent = 'base'
      this._ctx.$points = []
      this._ctx.lineWidth = 2
      this._ctx.clearRect(0, 0, 300, 400)
      if (!this.data._init && this.test.init) {
        this.test.init(this.data)
        this.data._init = true
      }
      if (this.test.base) {
        this.test.base.call(this.tools, this.data)
      }
      if (this.mouse && this.test.draw) {
        this._ctx.$agent = 'user'
        this.test.draw.call(this.tools, this.data, this.mouse)
      }
      if (this.status && this.test.test) {
        this._ctx.$agent = 'test'
        const diff = this.test.test.call(this.tools, this.data, this.mouse)
        this.result[this.index] = diff < 100 ? diff : 'failed'
      }
      this._ctx.lineWidth = 1
      this._ctx.fillStyle = 'white'
      this._ctx.$points.forEach(callback => callback.call(this._ctx))
    },
    onMousemove(event) {
      if (this.status) return
      this.mouse = {
        x: event.offsetX,
        y: event.offsetY,
      }
      this.refresh()
    },
    onMouseleave() {
      if (this.status) return
      this.mouse = null
      this.refresh()
    },
    onMousedown() {
      if (this.status) return
      this.status = 1
      this.refresh()
    },
    nextTest() {
      this.status = 0
      this.index += 1
      if (this.index === tests.length) {
        this.index = 0
        if (this.result.some(diff => typeof diff === 'number')) {
          this.results.push(new Array(tests.length))
          if (this.results.length > 10) {
            this.results.shift()
          }
        }
      }
      this.mouse = null
      this.refresh()
    },
    clearResult() {
      this.results = [ new Array(tests.length) ]
      this.index = 0
      this.status = 0
    },
    showDiff(roundId, testId) {
      const diff = this.results[roundId][testId]
      if (typeof diff !== 'number') {
        return roundId === this.round && testId === this.index ? '??' : '--'
      }
      return diff.toFixed(3).slice(0, 5)
    },
  },
}

</script>

<template>
  <div>
    <canvas height="400" width="300" ref="canvas" :class="{ finished: status }"
      @mousemove="onMousemove" @mouseleave="onMouseleave" @mousedown="onMousedown"/>
    <div class="container">
      <h2>{{ title }}</h2>
      <div class="caption">{{ test.caption }}</div>
      <div class="buttons">
        <div @click="nextTest">{{ status ? 'Next' : 'Skip' }}</div>
        <div @click="clearResult">Clear</div>
      </div>
      <hr/>
      <h2>Result</h2>
      <table>
        <tr v-for="(_, testId) in results[0]" :key="testId">
          <td>{{ tests[testId].name }}</td>
          <td v-for="(result, roundId) in results" :key="roundId">
            {{ showDiff(roundId, testId) }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>

& {
  top: 0;
  bottom: 0;
  width: 100vw;
  margin: auto;
  display: table;
  position: absolute;
}

> * {
  position: relative;
  display: table-cell;
}

> canvas {
  margin: 0 40px;
  border: 1px solid;
  vertical-align: middle;

  &:not(.finished) {
    cursor: pointer;
  }
}

> div.container {
  width: 100%;
  padding: 0 40px 0 0;
  vertical-align: top;

  > h2 {
    margin: 12px 0;
  }

  > .buttons {
    margin: 16px 0;

    > div {
      width: 48px;
      padding: 8px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1em;
      user-select: none;
      text-align: center;
      border-radius: 8px;
      transition: .3s ease;
      display: inline-block;
      background-color: beige;

      &:hover {
        background-color: bisque;
      }

      &:not(:first-child) {
        margin-left: 8px;
      }
    }
  }

  > table {
    td {
      width: 20px;
      padding: 0 8px;
      text-align: center;

      &:first-child {
        width: 40px;
        text-align: left;
      }
    }
  }
}

</style>
