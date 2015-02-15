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
    require('./find'),
    require('./find-all'),
    require('./create'),
    require('./update'),
    require('./delete')
  ], function (method) {
    method(opts);
  });

  return opts.app;
}
