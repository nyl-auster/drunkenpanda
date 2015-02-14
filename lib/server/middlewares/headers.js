'use strict';

var _ = require('lodash');
var express = require('express');
var config = require('../../services/config');

/**
 * Expose module.
 */

var app = module.exports = express();

app.use(function (req, res, next) {
  _.each(config.get('server:headers'), function (val, key) {
    res.header(key, val);
  });
  next();
});
