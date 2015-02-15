'use strict';

var _ = require('lodash');
var express = require('express');
var db = require('../../../../services/database');

/**
 * Expose module.
 */

module.exports = function (opts) {
  _.defaults(opts, {
    app: new express.Router()
  })
  .app.delete('/:uuid', function (req, res, next) {
    var query = [
      'MATCH (n:' + opts.label + ' { uuid: {uuid} })',
      'DELETE n'
    ].join('\n');

    db.cypher({
      query: query,
      params: {
        uuid: req.params.uuid
      }
    }, function (err) {
      if (err) return next(err);
      res.send();
    });
  });

  return opts.app;
};
