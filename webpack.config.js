const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {

  entry: './src/x-app.js',

  devServer: {
    contentBase: [path.join(__dirname, 'build/contracts'), path.join(__dirname, 'dist')],
    compress: true,
    open: true,
    port: 9000
  },

  plugins: [
    new HtmlWebpackPlugin({  // Also generate a test.html
      template: 'src/index.html'
    })]

};