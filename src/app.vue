<script>

const tests = require('./tests')
const tools = require('./palette')
const saveAs = require('file-saver')
const VERSION = '1.4'
const TEST_ROUND = 3

function getAverage(array) {
  return array.reduce((prev, curr) => prev + curr) / array.length
}

module.exports = {
  components: {
    visFrame: require('./frame.vue'),
    visScroll: require('./scroll.vue'),
  },

  data: () => ({
    index: 0,
    status: 0,
    mouse: null,
    isTesting: false,
    tests: tests.allItems,
    results: [],
  }),

  computed: {
    data() {
      const dataset = this.tests[this.index].dataset
      return dataset[this.round % dataset.length]
    },
    round() {
      return this.results.length - 1
    },
    testing: {
      get() {
        return this.isTesting
      },
      set(value) {
        if (this.isTesting === value) return
        this.isTesting = value
        if (value) {
          this.saveHistory()
          this.tests = tests.testItems
          this.clearResult()
        } else {
          this.tests = tests.allItems
          this.loadHistory()
        }
      },
    },
  },

  created() {
    this.loadHistory()
    this.TEST_ROUND = TEST_ROUND
    if (!this.results.length) {
      this.results.push(new Array(this.tests.length))
    }
  },

  mounted() {
    window.vm = this
    this._ctx = this.$refs.canvas.getContext('2d')
    this._ctx.lineCap = 'round'
    this.tools = {}
    for (const key in tools) {
      this.tools[key] = tools[key].bind(this._ctx)
    }
    this.refresh()

    addEventListener('beforeunload', () => {
      if (!this.testing) this.saveHistory()
    })
  },

  methods: {
    loadHistory() {
      let storage
      try {
        storage = JSON.parse(localStorage.getItem('shigma.eyeballing'))
      } catch (error) { null }
      if (storage && storage.version === VERSION) {
        this.results = storage.results
        this.index = storage.current
        this.status = 0
      }
      if (this._ctx) this.refresh()
    },
    saveHistory() {
      if (this.status) this.nextTest()
      localStorage.setItem('shigma.eyeballing', JSON.stringify({
        results: this.results,
        current: this.index,
        version: VERSION,
      }))
    },
    clearResult() {
      this.results = [ new Array(this.tests.length) ]
      this.index = 0
      this.status = 0
      this.refresh()
    },
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
        this.results[this.round][this.index] = diff
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
      if (this.testing) {
        if (!this.status) return
        if (this.index === this.tests.length - 1 && this.results.length >= TEST_ROUND) {
          const average = getAverage(this.results.map(getAverage)).toFixed(3).slice(0, 5)
          if (confirm(`\
测试完成，感谢您的配合！
您的总均分为：${average}。\n
点击“确定”回到练习模式，点击“取消”返回测试页面。`)) {
            saveAs(new File([JSON.stringify({
              version: VERSION,
              tests: this.tests.map(({ name }) => name),
              results: this.results,
            })], 'eyeballing-result.json', { type: 'application/json;charset=utf-8' }))
            this.testing = false
          }
          return
        }
      }
      this.status = 0
      this.index += 1
      if (this.index === this.tests.length) {
        this.index = 0
        if (this.results[this.round].some(diff => typeof diff === 'number')) {
          this.results.push(new Array(this.tests.length))
          if (this.results.length > 10) {
            this.results.shift()
          }
        }
      }
      this.mouse = null
      this.refresh()
    },
    diffText(roundId, testId) {
      const diff = this.results[roundId][testId]
      if (typeof diff !== 'number') {
        return roundId === this.round && testId === this.index ? '??' : '--'
      }
      return diff.toFixed(3).slice(0, 5)
    },
    toggleTest() {
      if (this.testing) {
        this.testing = !confirm('测试尚未完成，你确定要退出吗？')
      } else {
        this.testing = confirm(`\
测试开始后，计分板将暂时被重置（测试结束后可以复原）。
你将遇到 ${TEST_ROUND} 组题目，每组 ${tests.testItems.length} 道题，中途不允许跳过，全部作答完毕后将保存成绩。
你确定要开始测试吗？`)
      }
    },
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
        <div class="button" @click="toggleTest">
          {{ testing ? '退出测试' : '开始测试' }}
        </div>
        <div class="button" :class="{ disabled: !status && testing }" @click="nextTest">
          {{ status || testing
            ? round === TEST_ROUND - 1 && index === tests.length - 1
            ? '结束测试'
            : '下一题'
            : '跳过本题' }}
        </div>
        <div class="button" v-if="!testing" @click="clearResult">清除数据</div>
      </div>
    </template>
    <template slot="result">
      <h2>计分板</h2>
      <p v-if="testing">测试已经开始，完成测试后将自动回到练习模式。</p>
      <p v-else>正在进行练习模式。点击“开始测试”进入测试模式。</p>
      <p>表格中显示的数值为对应测试的误差，越小说明越精确。过大的误差将被判定为无效结果。</p>
      <vis-scroll direction="horizontal" class="result" ref="result"
        :style="{ height: 22 * Math.max(tests.length, 9) + 'px' }" :breadth="6" :radius="6">
        <div class="column">
          <div class="cell" v-for="(test, index) in tests" :key="index">
            {{ test.name }}
          </div>
        </div>
        <div class="column" v-for="(round, roundId) in results" :key="roundId">
          <div class="cell" v-for="(diff, testId) in round" :key="testId">
            {{ diffText(roundId, testId) }}
          </div>
        </div>
      </vis-scroll>
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

    div.button {
      width: 72px;
      padding: 10px 8px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1em;
      text-align: center;
      border-radius: 8px;
      transition: background-color .3s ease;
      display: inline-block;
      background-color: beige;

      &:hover {
        background-color: bisque;
      }

      &.disabled {
        cursor: default;
        background-color: lightgray !important;
      }

      &:not(:first-child) {
        margin-left: 8px;
      }
    }
  }

  > .result {
    overflow-x: hidden;
    white-space: nowrap;
    text-align: center;
    line-height: 1.4em;

    .column {
      width: 56px;
      display: inline-block;

      &:first-child {
        width: 80px;
      }
    }
  }
}

</style>
