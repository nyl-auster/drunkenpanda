'use strict';

var express = require('express');
var factory = require('./factory');

/**
 * Expose module.
 */

var app = module.exports = new express.Router();

/**
 * Default route.
 */

app.use('/users', factory({ label: 'User' }));
app.use('/instruments', factory({ label: 'Instrument' }));
