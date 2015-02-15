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
  .app.put('/:uuid', function (req, res, next) {
    var query = [
      'MATCH (n:' + opts.label + ' { uuid: {uuid} })',
      'SET n = {node}',
      'RETURN n'
    ].join('\n');

    db.cypher({
      query: query,
      params: {
        uuid: req.params.uuid,
        node: _.merge(req.body, { uuid: req.params.uuid })
      }
    }, function (err, results) {
      if (err) return next(err);
      res.send(results[0].n.properties);
    });
  });

  return opts.app;
};
