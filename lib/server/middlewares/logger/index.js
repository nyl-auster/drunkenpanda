'use strict';

var _ = require('lodash');
var util = require('util');
var logger = require('../../../services/logger');

/**
 * Expose module.
 */

module.exports = {
  requestLogger: requestLogger,
  errorLogger: errorLogger
};

/**
 *
 */

function requestLogger(req, res, next) {
  var start = new Date();

  res.once('finish', function () {
    logger.info(
      formatter.formatMessage(req, res),
      _.extend(
        formatter.formatMetas(req, res),
        {
          durationMs: new Date() - start
        }
      )
    );
  });

  next();
}

/**
 *
 */

function errorLogger(err, req, res, next) {
  var start = new Date();

  res.once('finish', function () {
    logger.error(
      formatter.formatMessage(req, res),
      _.extend(
        formatter.formatMetas(req, res),
        formatter.formatError(err),
        {
          durationMs: new Date() - start
        }
      )
    );
  });

  next(err);
}

/**
 *
 */

var formatter = {
  formatMessage: function (req, res) {
    return util.format('%s %d %s', req.method, res.statusCode, req.originalUrl);
  },

  formatMetas: function (req, res) {
    return {
      category: 'http-request',
      user: _.pick(req.user, 'id', 'email'),
      clientRequest: {
        ip: req.header('x-forwarded-for') ?
          req.header('x-forwarded-for').split(',')[0] :
          req.connection.remoteAddress,
        path: req.path,
        query: _.cloneDeep(req.query),
        headers: _.clone(req.headers),
        statusCode: res.statusCode
      }
    };
  },

  formatError: function (err) {
    if (!(err instanceof Error)) {
      return {
        error: {
          message: err.toString(),
          stack: null,
          code: null
        }
      };
    }

    return { error: _.pick(err, 'message', 'stack', 'code') };
  }
};
