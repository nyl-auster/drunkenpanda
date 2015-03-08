'use strict';

var _ = require('lodash');
var elasticsearch = require('elasticsearch');
var config = require('../config');
var searchIndexer = require('../../search-indexer');

/**
 * Expose module.
 */

module.exports = {
  client: new elasticsearch.Client(config.get('elasticsearch:client')),
  indexModel: function (model, object) {
    searchIndexer.index({
      index: config.get('elasticsearch:index'),
      type: model.type,
      id: object.id,
      body: _.omit(object, _.pluck(model.compositions, 'name'))
    });
  }
};
