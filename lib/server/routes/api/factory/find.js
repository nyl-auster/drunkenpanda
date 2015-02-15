'use strict';

var _ = require('lodash');
var express = require('express');
var db = require('../../../../services/database');
var error = require('../../../../services/error');

/**
 * Expose module.
 */

module.exports = function (opts) {
  _.defaults(opts, {
    app: new express.Router()
  })
  .app.get('/:uuid', function (req, res, next) {
    var query = [
      'MATCH (n:' + opts.label + ')',
      'WHERE n.uuid = {uuid}',
      'RETURN n'
    ].join('\n');

    db.cypher({
      query: query,
      params: {
        uuid: req.params.uuid
      }
    }, function (err, results) {
      if (err) return next(err);
      if (!results.length) return next(error('api:resourceNotFound'));

      res.send(results[0].n.properties);
    });
  });

  return opts.app;
};
