'use strict';

var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redis = require('../../../services/redis');
var config = require('../../../services/config');

/**
 * Expose module.
 */

module.exports = createSessionStore();

/**
 * Create a new session storage.
 *
 * @returns {RedisStore}
 */

function createSessionStore() {
  // Create redis store with a custom redis client.
  var redisStore = new RedisStore({
    client: redis.createClient(config.get('session:redis'))
  });

  // Quit redis on close.
  redisStore.close = function quitRedisClient(cb) {
    redisStore.client.quit(cb);
  };

  return redisStore;
}
