'use strict';

var url = require('url');
var seraph = require('seraph');
var config = require('../config');
var error = require('../error');

/**
 * Expose module.
 */

var db = seraph(url.format(config.get('neo4j:server')));

module.exports = {
  db: db,
  clean: clean
};

/**
 * Clear the database.
 */

function clean(cb) {
  if (config.get('neo4j:forbidClean')) return cb(error('db:cleanForbidden'));

  var query = [
    'MATCH (n)',
    'OPTIONAL MATCH (n)-[r]-()',
    'DELETE n,r'
  ].join('\n');

  db.query(query, cb);
}
