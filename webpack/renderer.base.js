const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, '..', 'src', 'renderer', 'index.tsx'),
  target: 'electron-renderer',
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-typescript',
            '@babel/preset-react',
            [
              '@babel/preset-env',
              {
                targets: {
                  electron: '7'
                }
              }
            ]
          ],
          plugins: [
            "@babel/plugin-proposal-optional-chaining"
          ]
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html'
    })
  ]
}
