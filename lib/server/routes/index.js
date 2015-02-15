'use strict';

var express = require('express');

/**
 * Expose module.
 */

var app = module.exports = new express.Router();

/**
 * Routes.
 */

app.use('/auth', require('./auth'));
app.use('/api', require('./api'));
