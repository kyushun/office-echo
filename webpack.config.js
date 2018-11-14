var path = require('path');
var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    main: './resources/app.jsx',
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: "main.js"
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.[s]?css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('style.css'),
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    inline: true,
    hot: true,
    host: '0.0.0.0',
    disableHostCheck: true
  }
}
