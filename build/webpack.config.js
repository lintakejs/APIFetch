const path = require("path");

module.exports = {
  devtool: 'source-map',

  mode: process.env.NODE_ENV,

  entry: "./index.ts",

  output: {
    path: path.resolve(__dirname, '../dist'),//输出路径，就是上步骤中新建的dist目录，
    publicPath: '/dist/',
    filename: 'APIfetch.min.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    rules:[
      {
        test: /\.(ts)$/, 
        use: 'ts-loader' 
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.ts']
  },
}