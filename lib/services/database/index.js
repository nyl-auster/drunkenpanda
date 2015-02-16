'use strict';

var _ = require('lodash');
var url = require('url');
var neo4j = require('neo4j');
var config = require('../config');
var error = require('../error');

/**
 * Expose module.
 */

var db = new neo4j.GraphDatabase(url.format(config.get('neo4j:server')));

module.exports = {
  db: db,
  clean: clean,
  populate: populate
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

  db.cypher({
    query: query
  }, cb);
}

/**
 * Populate the database.
 */

function populate(datas, cb) {
  var queries = _.map(datas, function (node) {
    var labels = _.reduce(node.__labels, function (result, label) {
      return result + ':' + label;
    }, '');

    return {
      query: 'CREATE (n' + labels + ' {node}) RETURN n',
      params: {
        node: _.omit(node, '__labels')
      }
    };
  });

  db.cypher({
    queries: queries
  }, cb);
}
