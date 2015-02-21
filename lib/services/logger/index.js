'use strict';

var _ = require('lodash');
var winston = require( 'winston' );
var config = require('../config');

/**
 * Expose module.
 */

module.exports = new winston.Logger({
  transports: _.map(config.get('logger:transports'), function (moduleOptions, transportModule) {
    return require(transportModule)(moduleOptions);
  })
});
