<script>

const tests = require('./tests').tests
const tools = require('./palette')

const VERSION = '1.1'

module.exports = {
  components: {
    visFrame: require('./frame.vue'),
  },

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
    data() {
      const dataset = this.tests[this.index].dataset
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
      const test = this.tests[this.index]
      const data = test.dataset[this.round % test.dataset.length]
      if (!data._init && test.init) {
        test.init(data)
        data._init = true
      }
      if (test.base) {
        test.base.call(this.tools, data)
      }
      if (this.mouse && test.draw) {
        this._ctx.$agent = 'user'
        test.draw.call(this.tools, data, this.mouse)
      }
      if (this.status && test.test) {
        this._ctx.$agent = 'test'
        const diff = test.test.call(this.tools, data, this.mouse)
        this.result[this.index] = diff < 100 ? diff : 'failed'
      }
      this._ctx.lineWidth = 1
      this._ctx.fillStyle = 'white'
      this._ctx.$points.forEach(callback => callback.call(this._ctx))
    },
    onMousemove(event) {
      if (this.status) return
      this.mouse = {
        x: event.offsetX / event.target.offsetWidth * 300,
        y: event.offsetY / event.target.offsetHeight * 400,
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
      this.refresh()
    },
    diffText(roundId, testId) {
      const diff = this.results[roundId][testId]
      if (typeof diff !== 'number') {
        return roundId === this.round && testId === this.index ? '??' : '--'
      }
      return diff.toFixed(3).slice(0, 5)
    },
    submit() {},
  },
}

</script>

<template>
  <vis-frame>
    <canvas slot="canvas" height="400" width="300" ref="canvas" :class="{ finished: status }"
      @mousemove="onMousemove" @mouseleave="onMouseleave" @mousedown="onMousedown"/>
    <template slot="heading">
      <h2>{{ tests[index].name }}</h2>
      <p class="caption" v-html="tests[index].caption"/>
      <div class="buttons">
        <div @click="nextTest">{{ status ? '下一题' : '跳过' }}</div>
        <div @click="clearResult">清除</div>
        <div @click="submit">提交</div>
      </div>
    </template>
    <template slot="result">
      <h2>计分板</h2>
      <p>表格中显示的数值为对应测试的误差，越小说明越精确。</p>
      <table>
        <tr v-for="(_, testId) in results[0]" :key="testId">
          <td>{{ tests[testId].name }}</td>
          <td v-for="(result, roundId) in results" :key="roundId">
            {{ diffText(roundId, testId) }}
          </td>
        </tr>
      </table>
    </template>
  </vis-frame>
</template>

<style lang="scss" scoped>

canvas:not(.finished) {
  cursor: pointer;
}

> .container {
  > h2 {
    margin: 12px 0;
  }

  > .buttons {
    margin: 16px 0;
    user-select: none;

    > div {
      width: 56px;
      padding: 8px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1em;
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
        width: 80px;
      }
    }
  }
}

</style>
