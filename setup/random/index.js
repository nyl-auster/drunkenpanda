'use strict';

var _ = require('lodash');
var async = require('async');

async.parallel(_.flatten([
  async.apply(require('./users'), 100)
]), process.exit.bind(process));
