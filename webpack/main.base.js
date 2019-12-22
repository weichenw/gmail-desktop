const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, '..', 'src', 'main', 'index.ts'),
  target: 'electron-main',
  output: {
    path: path.resolve(__dirname, '..', 'dist-js'),
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-typescript',
            [
              '@babel/preset-env',
              {
                targets: {
                  electron: '7'
                }
              }
            ]
          ]
        }
      }
    ]
  }
}
