const path = require('path')
const merge = require('webpack-merge')
const base = require('./renderer.base')

module.exports = merge(base, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '..', 'dist-js'),
    filename: 'index.js'
  }
})
