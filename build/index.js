const webpack = require('webpack')
const program = require('commander')
const sfc2js = require('sfc2js')
const html = require('html-minifier')
const path = require('path')
const fs = require('fs')

function fullPath(...names) {
  return path.join(__dirname, '..', ...names)
}

program
  .option('-d, --dev')
  .option('-p, --prod')
  .parse(process.argv)

sfc2js.install(require('@sfc2js/sass'), {
  outputStyle: 'compressed',
})

sfc2js.transpile({
  baseDir: fullPath(),
  srcDir: 'src',
  outDir: 'temp',
})

fs.writeFileSync(
  fullPath('docs/index.html'),
  html.minify(fs.readFileSync(fullPath('src/index.html')).toString(), {
    collapseWhitespace: true,
    removeAttributeQuotes: true,
  })
)

const compiler = webpack({
  target: 'web',
  mode: program.prod ? 'production' : 'development',
  entry: fullPath('temp/index.js'),
  resolve: {
    alias: {
      '@': fullPath('temp')
    }
  },
  output: {
    path: fullPath('docs'),
    filename: 'index.js',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  }
})

new webpack.ProgressPlugin().apply(compiler)

compiler.run((error, stat) => {
  if (error) {
    console.log(error)
    process.exit(1)
  } else if (stat.compilation.errors.length) {
    console.log(stat.compilation.errors.join('\n'))
    process.exit(1)
  } else {
    console.log('Bundle Succeed.')
    process.exit(0)
  }
})
