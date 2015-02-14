'use strict';

var _ = require('lodash');
var config = require('../services/config');

/**
 * Expose modules.
 */

module.exports = {
  start: start
};

/**
 * Start a server.
 */

function start (opts) {
  opts = _.defaults(opts || {}, config.get('server'));

  var app = require('./app');
  app.listen(opts.port);
  console.log('Server listening on at http://localhost:' + opts.port);

  return app;
}
