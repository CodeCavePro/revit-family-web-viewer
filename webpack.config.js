const path = require('path');

module.exports = {
  entry: "./index.ts",
  context: __dirname + "/src",
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ],
    loaders: [
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  resolve: {
    extensions: [  '.js', '.jsx', '.tsx', '.ts' ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/js')
  },
  node: {
    console: false,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
