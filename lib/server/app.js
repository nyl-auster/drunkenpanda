'use strict';

var express = require('express');
var expressWinston = require('express-winston');
var errorHandler = require('./middlewares/error-handler');
var logger = require('../services/logger');
var error = require('../services/error');

/**
 * Expose modules.
 */

var app = module.exports = express();

app.enable('trust proxy');

/**
 * Setup middlewares.
 */

app.use(expressWinston.logger({ winstonInstance: logger }));

app.use(require('./middlewares/headers'));
app.use(require('./middlewares/auth'));
app.use(require('./routes'));

app.use(function (req, res, next) {
  next(error('http:notFound'));
});

app.use(expressWinston.errorLogger({ winstonInstance: logger }));

app.use(errorHandler);
