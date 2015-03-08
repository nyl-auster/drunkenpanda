'use strict';

var _ = require('lodash');
var model = require('seraph-model');
var db = require('../services/database').db;
var search = require('../services/search');

/**
 * Expose model.
 */

var Instrument = module.exports = model(db, 'Instrument');

/**
 * Schema.
 */

Instrument.schema = {
  name: { type: String, required: true }
};

Instrument.setUniqueKey('name');

/**
 * Index instrument for search
 */

Instrument.on('afterSave', _.partial(search.indexModel, Instrument));
