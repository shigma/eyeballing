<script>

module.exports = {
  mounted() {
    window.vm = this
    this._context = this.$refs.canvas.getContext('2d')
    this._context.fillStyle = 'yellow'
    this._context.fillRect(20, 20, 150, 150)
  }
}

</script>

<template>
  <div>
    <canvas height="400" width="300" ref="canvas"/>
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
  display: table-cell;
  vertical-align: middle;
}

> canvas {
  border: 1px solid;
  margin: 0 40px;
}

</style>
