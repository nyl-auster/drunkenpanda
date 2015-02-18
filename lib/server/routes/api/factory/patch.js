'use strict';

var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var error = require('../../../../services/error');

/**
 * Expose module.
 */

module.exports = function (opts) {
  _.defaults(opts, {
    app: new express.Router()
  })
  .app.patch('/:id', bodyParser.json(), function (req, res, next) {
    opts.model.read(req.params.id, function (err, resource) {
      if (err) return next(err);
      if (!resource) return next(error('api:notFound'));

      opts.model.save(_.defaults({ id: req.params.id }, req.body, resource), function (err, result) {
        if (err) return next(err);
        res.send(result);
      });
    });
  });

  return opts.app;
};
