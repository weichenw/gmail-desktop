const merge = require('webpack-merge')
const base = require('./main.base')

module.exports = merge(base, {
  mode: 'production'
})
