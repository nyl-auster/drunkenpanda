'use strict';

var _ = require('lodash');
var express = require('express');
var uuid = require('node-uuid');
var db = require('../../../../services/database');

/**
 * Expose module.
 */

module.exports = function (opts) {
  _.defaults(opts, {
    app: new express.Router()
  })
  .app.post('/', function (req, res, next) {
    var query = [
      'CREATE (n:' + opts.label + ' {node})',
      'RETURN n'
    ].join('\n');

    db.cypher({
      query: query,
      params: {
        node: _.merge(req.body, { uuid: uuid.v1() })
      }
    }, function (err, results) {
      if (err) return next(err);
      res.send(results[0].n.properties);
    });
  });

  return opts.app;
};
