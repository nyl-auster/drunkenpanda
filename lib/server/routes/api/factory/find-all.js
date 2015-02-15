'use strict';

var _ = require('lodash');
var express = require('express');

/**
 * Expose module.
 */

module.exports = function (opts) {
  _.defaults(opts, {
    app: new express.Router()
  })
  .app.get('/', function (req, res, next) {
    opts.api.findAll(function (err, result) {
      if (err) return next(err);
      res.send(result);
    });
  });

  return opts.app;
};
