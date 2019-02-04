const path = require('path');

module.exports = {
  // __dirname 为当前模块的目录名
  // path.resolve 从右至左拼接地址，直到返回一个绝对路径
  entry: path.resolve(__dirname, 'src/index.umd.js'),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vue.js',
    // library 与 libraryTarget 一同使用
    // 以 umd 的方式暴露模块 Vue，即暴露为所有的模块定义下都可运行的方式
    library: 'Vue',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }],
  },
  // TODO: 监听选项 to be removed
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    ignored: /node_modules/,
  },
};
