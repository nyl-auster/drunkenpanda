'use strict';

var _ = require('lodash');
var url = require('url');
var neo4j = require('node-neo4j');
var config = require('../config');

/**
 * Expose module.
 */

var db = module.exports = new neo4j(url.format(config.get('neo4j:server')));

db.readNodeWithLabel = function (id, label, callback) {
  this.readLabels(id, function (err, labels) {
    if (err) return callback(err);
    if (!_.contains(labels, label)) return callback();

    db.readNode(id, callback);
  });
};
