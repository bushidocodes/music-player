import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
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
    static: { directory: path.join(__dirname, 'browser') },
    proxy: [
      {
        context: ['/api', '/bootstrap', '/bootstrap-icons', '/favicon.ico'],
        target: 'http://localhost:1337',
      },
    ],
  },
};
