/* eslint global-require: "off" */
/* eslint import/no-extraneous-dependencies: "off" */

const config = require('../config');

const port = require('./port');
const server = require('./server');

const logger = require('./logger');

process.on('uncaughtException', err => logger.error('uncaughtException', err.stack));
process.on('unhandledRejection', (reason, p) => {
  logger.error('unhandledRejection', `Unhandled Rejection at: ${p}`);
  logger.error('unhandledRejection', `reason: ${reason}`);
});

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require('../webpack.config');

const compiler = webpack(webpackConfig);
const devServer = new WebpackDevServer(compiler, {
  disableHostCheck: true,
  historyApiFallback: true,
  contentBase: config.outputdir,
  stats: {
    colors: { level: 1, hasBasic: true, has256: false, has16m: false },
    assets: true,
    chunks: false,
    cached: false,
    modules: false,
    reasons: false,
    publicPath: true,
    errorDetails: true,
    cachedAssets: false,
    chunkOrigins: false,
  },
  proxy: {
    '**': `http://localhost:${port + 1}`,
  },
});

devServer.middleware.waitUntilValid(() => {
  server.listen(port + 1, '0.0.0.0', () => {
    logger.info('server/index', `server is listen at ${JSON.stringify(server.address())}`);
  });
});

devServer.listen(port, '0.0.0.0', () => {
  logger.info('server/index', 'webpack dev server running');
});
