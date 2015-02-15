'use strict';

var _ = require('lodash');
var express = require('express');
var db = require('../../../../services/database');

/**
 * Expose module.
 */

module.exports = find;

function find(opts) {
  _.defaults(opts, {
    app: new express.Router()
  })
  .app.route('/:id').get(function (req, res, next) {
    db.readNodeWithLabel(req.params.id, opts.label, function (err, node) {
      if (err) return next(err);
      res.send(node);
    });
  });

  return opts.app;
}
