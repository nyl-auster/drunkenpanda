'use strict';

var _ = require('lodash');
var redis = require('redis');
var config = require('../config');
var logger = require('../logger');

/**
 * Expose module.
 */

exports.createClient = createClient;

/**
 * Create a redis client.
 */

function createClient(options) {
  options = _.defaults(options || {}, config.get('redis:server'));

  // Create the redis client.
  var client = redis.createClient(
    options.port,
    options.host,
    _.omit(options, 'port', 'host')
  );

  // Log errors.
  client.on('error', function logError(err) {
    logger.error(err, {
      category: 'redis'
    });
  });

  // Select a custom db.
  if (options.db) client.select(options.db);

  return client;
}
