'use strict';

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

Instrument.on('afterSave', function (instrument) {
  search.indexModel(Instrument, instrument);
});
