'use strict';

var _ = require('lodash');
var config = require('../services/config');
var app = require('./app');

/**
 * Expose modules.
 */

module.exports = new Server();

/**
 * Server constructor.
 */

function Server() {
  this.app = app;
}

/**
 * Start a server.
 */

Server.prototype.start = function (opts) {
  opts = _.defaults(opts || {}, config.get('server'));

  this.app.listen(opts.port);
  console.log('Server listening on at http://localhost:' + opts.port);
};
