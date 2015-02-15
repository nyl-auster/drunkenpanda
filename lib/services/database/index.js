'use strict';

var url = require('url');
var neo4j = require('neo4j');
var config = require('../config');

/**
 * Expose module.
 */

module.exports = new neo4j.GraphDatabase(url.format(config.get('neo4j:server')));
