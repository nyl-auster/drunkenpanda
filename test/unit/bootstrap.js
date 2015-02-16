'use strict';

// Force node environment
process.env.NODE_ENV = 'test';

var async = require('async');

/**
 * Global variables that might be used in tests.
 */

global.chai = require('chai');
global.sinon = require('sinon');
global.expect = chai.expect;

/**
 * Chai config.
 */

chai.config.includeStack = true;
chai.use(require('sinon-chai'));

beforeEach(function (done) {
  var dbService = require('../../lib/services/database');
  var datas = require('../fixtures/database.json');

  async.series([
    dbService.clean,
    async.apply(dbService.populate, datas)
  ], done);
});
