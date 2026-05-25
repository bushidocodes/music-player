'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './browser/react/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.[contenthash].js',
    clean: true,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './browser/index.html',
    }),
  ],
  devServer: {
    port: 3000,
    hot: true,
    // CSS files (bootstrap-dark.css, style.css) live in browser/
    static: { directory: path.join(__dirname, 'browser') },
    proxy: [
      {
        // API calls and Bootstrap CSS (served from node_modules by Express)
        context: ['/api', '/bootstrap', '/favicon.ico'],
        target: 'http://localhost:1337',
      },
    ],
  },
};
