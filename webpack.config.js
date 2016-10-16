var path = require('path');

var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');

var plugins = [
  new CleanPlugin('builds'),
  new webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false
      },
  }),
];

module.exports = {
  entry: './src',
  output: {
    path: 'builds/',
    filename: 'wltpl.js',
    libraryTarget: "umd",
  },
  plugins: plugins,
  module: {
    loaders: [{
      test: /\.js$/,
      include: /src/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      },
    }, ],
  }
};