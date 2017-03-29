const path = require('path');
const webpack = require('webpack');
const LiveUpdateServer = require('live-update-server');

var clientCode = LiveUpdateServer.getClientCode({callback: function (msg) {
  console.log('Updating CSS');
  var sheet = document.getElementById('main-stylesheet');
  sheet.href = sheet.href.split('?')[0] + ('?noCache=' + Date.now());
}});

module.exports = function (env) {
  // NOTE: 'env' isn't currently used but can be provided by using --env.foo arguments on the command line

  var plugins; // set below

  if (process.env.NODE_ENV == 'production') {
    console.log('\nPRODUCTION BUILD\n');
    plugins = [
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ];
  } else {
    plugins = [new webpack.BannerPlugin({banner: clientCode, raw: true, entryOnly: true})];
  }

  return {
    entry: {
      App: './js/App.js'
    },
    output: {
      filename: '[name].js',
      path: './dist'
    },
    resolve: {
      modules: ['node_modules', path.resolve('./src/js')]
    },
    plugins,
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            cacheDirectory: true,
            presets: [
              ['es2015', {"modules": false}],
              'react'
            ]
          }
        }
      ]
    },
    devtool: "source-map"
  };
};
