<script>

module.exports = {
  data: () => ({
    windowWidth: 0,
    windowHeight: 0,
    horizontal: true,
  }),

  computed: {
    contentHeight() {
      return this.windowHeight - 120
    },
    contentStyle() {
      return this.horizontal ? { height: this.contentHeight + 'px' } : {}
    },
    canvasWidth() {
      return Math.min(this.contentHeight * 0.75, this.windowWidth / 2.4)
    },
    canvasStyle() {
      if (!this.horizontal) return { width: '300px', height: '400px' }
      const marginX = this.canvasWidth / 7.5 + 'px'
      const marginY = (this.contentHeight - this.canvasWidth / 0.75) / 2 + 'px'
      return {
        width: this.canvasWidth + 'px',
        height: this.canvasWidth / 0.75 + 'px',
        marginLeft: marginX,
        marginRight: marginX,
        marginTop: marginY,
        marginBottom: marginY,
      }
    },
    containerStyle() {
      return this.horizontal ? { width: this.windowWidth - this.canvasWidth * 1.4 + 'px' } : {}
    },
  },

  created() {
    this.updateSize()

    addEventListener('resize', () => {
      this.updateSize()
    })
  },

  methods: {
    updateSize() {
      this.windowWidth = innerWidth
      this.windowHeight = innerHeight
      if (innerWidth < 780) {
        this.horizontal = false
        document.body.style.overflowY = 'auto'
      } else {
        this.horizontal = true
        document.body.style.overflowY = 'hidden'
      }
    },
  }
}

</script>

<template>
  <div :class="{ horizontal }" :style="contentStyle">
    <div v-if="!horizontal" class="container">
      <slot name="heading"/>
    </div>
    <div class="palette" :style="canvasStyle">
      <slot name="canvas"/>
    </div>
    <div class="container" :style="containerStyle">
      <template v-if="horizontal">
        <slot name="heading"/>
        <hr/>
      </template>
      <slot name="result"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>

& {
  top: 0;
  bottom: 0;
  width: 100vw;
  margin: auto;
  position: absolute;
}

&.horizontal > * {
  position: relative;
  display: inline-block;
}

&.horizontal > .palette {
  vertical-align: middle;
}

&:not(.horizontal) > .palette {
  margin: 20px auto;
}

> .palette {
  border: 1px solid;

  canvas {
    width: 100%;
  }
}

&.horizontal > .container {
  margin-left: 4px;
  vertical-align: top;
}

&:not(.horizontal) > .container {
  margin: 40px 32px;
}

</style>
