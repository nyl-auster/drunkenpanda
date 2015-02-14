'use strict';

var express = require('express');

/**
 * Expose modules.
 */

var app = module.exports = express();

/**
 * Setup middlewares.
 */

app.use(require('./middlewares/headers'));
app.use(require('./routes'));
