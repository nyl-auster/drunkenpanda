'use strict';

var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

/**
 * Expose module.
 */

module.exports = function (opts) {
  _.defaults(opts, {
    app: new express.Router()
  })
  .app.post('/', bodyParser.json(), function (req, res, next) {
    opts.model.save(req.body, function (err, result) {
      if (err) return next(err);
      res.status(201).send(result);
    });
  });

  return opts.app;
};
