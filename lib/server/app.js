'use strict';

var express = require('express');
var errorHandler = require('express-err');

/**
 * Expose modules.
 */

var app = module.exports = express();

app.enable('trust proxy');

/**
 * Setup middlewares.
 */

app.use(require('./middlewares/logger').requestLogger);

app.use(require('./middlewares/headers'));
app.use(require('./middlewares/auth'));
app.use(require('./routes'));

app.use(errorHandler.httpError(404));

app.use(require('./middlewares/logger').errorLogger);

// Error handling
app.use(errorHandler({
  exitOnUncaughtException: false
}));
