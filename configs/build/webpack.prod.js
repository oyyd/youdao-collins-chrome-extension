const path = require('path')
const webpack = require('webpack')

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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false,
      },
    }),
  ],
}
