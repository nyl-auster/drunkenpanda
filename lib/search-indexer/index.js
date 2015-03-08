'use strict';

var _ = require('lodash');
var url = require('url');
var rabbit = require('rabbit.js');
var config = require('../services/config');
var error = require('../services/error');
var logger = require('../services/logger');
var search = require('../services/search');

/**
 * Expose module.
 */

module.exports = new Indexer();

/**
 * Indexer constructor.
 */

function Indexer() {
  this.ready = false;
  this.context = rabbit.createContext(url.format(config.get('rabbitmq:server')));

  this.context.once('ready', _.bind(function () {
    this.ready = true;

    this.push = this.context.socket('PUSH');
    this.push.connect('search:indexer');

  }, this));

  process.once('exit', _.bind(function () {
    this.context.close();
  }, this));
}

/**
 * Listen for item to index.
 */

Indexer.prototype.listen = function () {
  if (!this.ready) return this.context.once('ready', _.bind(this.listen, this));

  var pull = this.context.socket('PULL');
  pull.connect('search:indexer');
  pull.setEncoding(config.get('rabbitmq:encoding'));

  pull.on('data', _.bind(function(data) {
    try {
      data = JSON.parse(data);
    } catch (e) {
      logger.error(error('search:indexer:invalidJson'));
      return;
    }

    search.client.index(data);
  }, this));
};

/**
 * Index an item.
 */

Indexer.prototype.index = function (data) {
  if (!this.ready) return this.context.once('ready', _.bind(this.write, this, data));

  this.push.write(JSON.stringify(data), config.get('rabbitmq:encoding'));
};
