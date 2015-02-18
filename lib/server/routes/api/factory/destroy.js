'use strict';

var _ = require('lodash');
var express = require('express');
var error = require('../../../../services/error');

/**
 * Expose module.
 */

module.exports = function (opts) {
  _.defaults(opts, {
    app: new express.Router()
  })
  .app.delete('/:id', function (req, res, next) {
    opts.model.exists(req.params.id, function (err, doesExist) {
      if (err) return next(err);
      if (!doesExist) return next(error('api:notFound'));

      opts.model.db.node.delete(req.params.id, function (err) {
        if (err) return next(err);
        res.status(204).send();
      });
    });
  });

  return opts.app;
};
