const path = require('path');
const ls = require('ls');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const INTERFACE_THEME = ${__import__('json').dumps(interfaces_theme)};

const plugins = [];
const entry = {};

// The dev mode will be used for builds on local machine outside docker
const nodeEnv = process.env['NODE_ENV'] || 'development';
const dev = nodeEnv == 'development'
process.traceDeprecation = true;

const name = process.env.INTERFACE;
process.env.THEME = INTERFACE_THEME[name];

entry[name] = path.resolve(__dirname, 'geoportal/${package}_geoportal/static-ngeo/js/apps/Controller' + name + '.js');
plugins.push(
  new HtmlWebpackPlugin({
    inject: false,
    template: '/src/geoportal/${package}_geoportal/static-ngeo/js/apps/' + name + '.html.ejs',
    chunksSortMode: 'manual',
    filename: name + '.html',
    chunks: [name],
  })
);

const babelPresets = [['env',{
  "targets": {
    "browsers": ["last 2 versions", "Firefox ESR", "ie 11"],
  },
  "modules": false,
  "loose": true,
}]]

// Transform code to ES2015 and annotate injectable functions with an $inject array.
const projectRule = {
  test: /geoportal\/demo_geoportal\/static-ngeo\/js\/.*\.js$/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: babelPresets,
      plugins: ['@camptocamp/babel-plugin-angularjs-annotate'],
    }
  },
};

const rules = [
  projectRule
];


module.exports = {
  output: {
    path: path.resolve(__dirname, 'geoportal/demo_geoportal/static-ngeo/build/'),
    publicPath: dev ? '/${instanceid}/dev/' : '/${instanceid}/wsgi/static-ngeo/UNUSED_CACHE_VERSION/build/'
  },
  entry: entry,
  module: {
    rules
  },
  plugins: plugins,
};
