const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('./config');

const jsfilename = '[name].bundle.js';
const cssfilename = '[name].bundle.css';
const bundlename = '[path][name].[ext]';

const extractCss = new ExtractTextPlugin(cssfilename);
const vendorChunk = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: Infinity,
});

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: ['es2015', 'react'],
  },
};

const plugins = [
  new HtmlWebpackPlugin({
    filename: `example.html`,
    template: `./example/template.ejs`,
  }),
  extractCss,
  vendorChunk,
];

module.exports = {
  entry: {
    example: './example/client.js',
    vendor: [
      'react',
      'react-dom',
      'prop-types',
    ],
  },
  output: {
    filename: jsfilename,
    chunkFilename: jsfilename,
    path: config.outputdir,
    pathinfo: true,
    publicPath: config.rootdir,
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: babelLoader,
    }, {
      test: /\.css/,
      use: extractCss.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
        }],
      }),
    }, {
      test: /\.json$/,
      use: 'json-loader',
    }],
  },
  plugins,
};

if (require.main === module) {
  console.info(module.exports); // eslint-disable-line
}
