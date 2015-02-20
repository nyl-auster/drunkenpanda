'use strict';

var elasticsearch = require('elasticsearch');
var config = require('../config');

/**
 * Expose module.
 */

module.exports = new elasticsearch.Client(config.get('elasticsearch:client'));
