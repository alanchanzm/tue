const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  // __dirname 为当前模块的目录名
  // path.resolve 从右至左拼接地址，直到返回一个绝对路径
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vue.js',
    library: 'Vue',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }],
  },
  plugins: [
    new HtmlWebPackPlugin({
      title: 'Vue',
      template: './index.html',
      filename: './index.html',
    }),
  ],
};
