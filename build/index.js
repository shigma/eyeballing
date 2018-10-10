const webpack = require('webpack')
const program = require('commander')
const path = require('path')

function fullPath(...names) {
  return path.join(__dirname, '..', ...names)
}

program
  .option('-d, --dev')
  .option('-p, --prod')
  .parse(process.argv)

const compiler = webpack({
  target: 'web',
  mode: program.prod ? 'production' : 'development',
  entry: fullPath('src/index.js'),
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
