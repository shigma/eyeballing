<script>

const tests = require('./tests')
const tools = require('./palette')
const saveAs = require('file-saver')
const UAParser = require('ua-parser-js')
const VERSION = '1.5'
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
    timing: false,
    restTime: 0,
    startTime: 0,
    index: 0,
    status: 0,
    mouse: null,
    baseRound: 0,
    testing: false,
    tests: tests.allItems,
    results: [],
  }),

  computed: {
    round() {
      return this.results.length - 1
    },
    test() {
      return this.tests[this.index]
    },
    remaining() {
      const time = Math.floor(this.restTime / 1000)
      const mm = String(Math.floor(time / 60)).padStart(2, '0')
      const ss = String(Math.floor(time % 60)).padStart(2, '0')
      return `${mm}:${ss}`
    },
  },

  watch: {
    testing(value) {
      if (value) {
        this.restTime = 600000
        this.startTime = performance.now()
        this.saveHistory()
        this.tests = tests.testItems
        this.clearResult()
      } else {
        this.startTime = 0
        this.tests = tests.allItems
        this.loadHistory()
      }
    },
    restTime(value) {
      if (!this.testing || value > 0) return
      if (this.index < this.tests.length - 1 || this.results.length < TEST_ROUND) {
        alert('时间已到，测试结束。')
        this.testing = false
      }
    },
  },

  created() {
    this.loadHistory()
    this.TEST_ROUND = TEST_ROUND
    if (!this.results.length) {
      this.results.push(new Array(this.tests.length))
      this.roundClean = true
    }
  },

  mounted() {
    window.vm = this
    window.UAParser = UAParser
    this._ctx = this.$refs.canvas.getContext('2d')
    this._ctx.lineCap = 'round'
    this.tools = {}
    for (const key in tools) {
      this.tools[key] = tools[key].bind(this._ctx)
    }
    this.refresh()

    setInterval(() => {
      if (this.startTime) {
        const now = performance.now()
        this.restTime -= now - this.startTime
        this.startTime = now
      }
    }, 100)

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
        this.baseRound = storage.baseRound
        this.results = storage.results
        this.index = storage.current
        this.status = 0
        this.roundClean = this.results[this.round].every(diff => typeof diff !== 'number')
      }
      if (this._ctx) this.refresh()
    },
    saveHistory() {
      if (this.status) this.nextTest()
      localStorage.setItem('shigma.eyeballing', JSON.stringify({
        baseRound: this.baseRound,
        results: this.results,
        current: this.index,
        version: VERSION,
      }))
    },
    clearResult() {
      this.results = [ new Array(this.tests.length) ]
      this.roundClean = true
      this.baseRound = 0
      this.status = 0
      this.index = 0
      this.refresh()
    },
    refresh() {
      this._ctx.$agent = 'base'
      this._ctx.$points = []
      this._ctx.lineWidth = 2
      this._ctx.clearRect(0, 0, 300, 400)
      const dataset = this.test.dataset
      const data = dataset[(this.round + this.baseRound) % dataset.length]
      if (!data._init && this.test.init) {
        this.test.init(data)
        data._init = true
      }
      if (this.test.base) {
        this.test.base.call(this.tools, data)
      }
      if (this.mouse && this.test.draw) {
        this._ctx.$agent = 'user'
        this.test.draw.call(this.tools, data, this.mouse)
      }
      if (this.status && this.test.test) {
        this._ctx.$agent = 'test'
        const diff = this.test.test.call(this.tools, data, this.mouse)
        this.results[this.round][this.index] = diff
        this.roundClean = false
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
      this.restTime -= performance.now() - this.startTime
      this.startTime = 0
      this.refresh()
    },
    nextTest() {
      if (this.testing) {
        if (!this.status) return
        if (this.index === this.tests.length - 1 && this.results.length === TEST_ROUND) {
          const average = getAverage(this.results.map(getAverage)).toFixed(3).slice(0, 5)
          const isTheFuckingEdgeBrowser = UAParser().browser.name === 'Edge'
          if (confirm(`\
测试完成，感谢您的配合！
您的总均分为：${average}。\n
点击“确定”回到练习模式，点击“取消”返回测试页面。\
${!isTheFuckingEdgeBrowser ? '' : `\n
检测到你使用了 Edge 浏览器，请 F12 打开控制台后，复制最后一段输出的内容作为本次测试的结果文件。`}`)) {
            const output = JSON.stringify({
              version: VERSION,
              tests: this.tests.map(({ name }) => name),
              results: this.results,
            })
            if (isTheFuckingEdgeBrowser) {
              console.log(output)
            } else {
              saveAs(new File([output], 'eyeballing-result.json', {
                type: 'application/json;charset=utf-8'
              }))
            }
            this.testing = false
          }
          return
        }
      }
      this.startTime = performance.now()
      this.status = 0
      this.index += 1
      if (this.index === this.tests.length) {
        this.index = 0
        this.newRound()
      }
      this.mouse = null
      this.refresh()
    },
    nextRound() {
      this.newRound()
      this.status = 0
      this.mouse = null
      this.refresh()
    },
    newRound() {
      if (this.roundClean) {
        this.baseRound = (this.baseRound + 1) % this.test.dataset.length
        return
      }
      this.results.push(new Array(this.tests.length))
      this.roundClean = true
      if (this.results.length > 10) {
        this.results.shift()
      }
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
      @mousemove="onMousemove" @mousedown.left="onMousedown" @mouseleave="onMouseleave"/>
    <template slot="heading">
      <h2>{{ test.name }}</h2>
      <p class="caption" v-html="test.caption"/>
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
        <div class="button" v-if="!testing" @click="nextRound">下一轮</div>
        <div class="button" v-if="!testing" @click="clearResult">清除数据</div>
      </div>
    </template>
    <template slot="result">
      <h2>计分板</h2>
      <p v-if="testing">测试已经开始。完成测试后点击“结束测试”将回到练习模式。剩余时间：{{ remaining }}</p>
      <p v-else>正在进行练习模式。点击“开始测试”进入测试模式。</p>
      <p>表格中显示的数值为对应测试的误差，越小说明越精确。</p>
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
