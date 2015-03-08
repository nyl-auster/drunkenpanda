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

app.use('/users', factory({ model: require('../../../models/user') }));
app.use('/instruments', factory({ model: require('../../../models/instrument') }));
