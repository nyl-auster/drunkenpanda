'use strict';

var _ = require('lodash');
var express = require('express');
var db = require('../../../../services/database');

/**
 * Expose module.
 */

module.exports = findAll;

function findAll(opts) {
  _.defaults(opts, {
    app: new express.Router()
  })
  .app.route('/').get(function (req, res, next) {
    db.readNodesWithLabel(opts.label, function (err, users) {
      if (err) return next(err);
      res.send(users);
    });
  });

  return opts.app;
}
