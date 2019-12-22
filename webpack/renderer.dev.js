const merge = require('webpack-merge')
const base = require('./renderer.base')

module.exports = merge(base, {
  mode: 'development'
})
