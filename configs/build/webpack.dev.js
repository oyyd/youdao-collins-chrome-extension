const path = require('path')

function relative(p) {
  return path.resolve(__dirname, p)
}

function appendDeps(file) {
  return [
    'babel-polyfill',
    file,
  ]
}

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    popup: appendDeps(relative('../../src/popup')),
    '../dev/dev': appendDeps(relative('../../src/dev')),
    event_page: appendDeps(relative('../../src/event_page')),
    content_script: appendDeps(relative('../../src/content_script')),
    options_page: appendDeps(relative('../../src/options_page')),
    words_page: appendDeps(relative('../../src/words_page')),
  },
  output: {
    path: relative('../../build'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          relative('../../src'),
        ],
        loader: 'babel-loader',
      },
    ],
  },
}
