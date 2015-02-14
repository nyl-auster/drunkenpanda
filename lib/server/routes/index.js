'use strict';

var express = require('express');

/**
 * Expose module.
 */

var app = module.exports = new express.Router();

/**
 * Default route.
 */

app.use('/api', require('./api'));
