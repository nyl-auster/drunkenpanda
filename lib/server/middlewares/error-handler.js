'use strict';

var _ = require('lodash');
var error = require('../../services/error');

/**
 * Expose middleware.
 */

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  /* jshint unused:false */
  if (err.constructor.name !== error.constructorName)
    err = error('http:internalServerError');

  res.status(err.status).send({
    error: _.omit(err, 'status')
  });
}
