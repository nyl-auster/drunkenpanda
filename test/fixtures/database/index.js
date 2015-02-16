'use strict';

var _ = require('lodash');
var db = require('../../../lib/services/database');

module.exports = {
  clean: clean,
  populate: populate
};

/**
 * Clear the database.
 */

function clean(cb) {
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

function populate(cb) {
  var datas = require('./datas.json');

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
