'use strict';

var _ = require('lodash');
var async = require('async');
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
    async.waterfall([
      function getLabel(next) {
        db.readLabels(req.params.id, next);
      },
      function checkLabel(labels, next) {
        if (!_.contains(labels, opts.label)) return next('Invalid label');
        next();
      },
      function getNode(next) {
        db.readNode(req.params.id, next);
      }
    ], function (err, node) {
      if (err) return next(err);
      res.send(node);
    });
  });

  return opts.app;
}
