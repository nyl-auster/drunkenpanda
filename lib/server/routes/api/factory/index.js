'use strict';

var _ = require('lodash');
var express = require('express');

/**
 * Expose module.
 */

module.exports = factory;

/**
 * Resource factory.
 */

function factory(opts) {
  _.defaults(opts, { app: new express.Router() });

  _.each([
    require('./create'),
    require('./update'),
    require('./delete'),
    require('./find'),
    require('./find-all')
  ], function (method) {
    method(opts);
  });

  return opts.app;
}
