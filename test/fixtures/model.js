'use strict';

var model = require('seraph-model');
var db = require('../../lib/services/database').db;

/**
 * Expose test model.
 */

module.exports = model(db, 'Test');
