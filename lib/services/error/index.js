'use strict';

var _ = require('lodash');
var util = require('util');
var path = require('path');
var errors = require('nconf').file(path.join(__dirname, 'errors.json'));

/**
 * Expose module.
 */

module.exports = getError;

/**
 * Read error from configuration.
 */

function getError (key) {
  var err = errors.get(key);
  if (! err) throw new Error(util.format('Unable to find error %s.', key));

  err.code = key;

  return new DrunkenPandaError(err);
}

/**
 * Create a new DrunkenPandaError.
 */

function DrunkenPandaError(error) {
  Error.captureStackTrace(this, DrunkenPandaError);
  _.extend(this, error);
}

/**
 * Inherits from Error.
 */

util.inherits(DrunkenPandaError, Error);
