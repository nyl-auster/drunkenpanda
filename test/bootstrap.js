'use strict';

var async = require('async');

// Force node environment
process.env.NODE_ENV = 'test';

/**
 * Global variables that might be used in tests.
 */

chai = require('chai');
sinon = require('sinon');
expect = chai.expect;

/**
 * Chai config.
 */

chai.config.includeStack = true;
chai.use(require('sinon-chai'));

beforeEach(function (done) {
  var db = require('./fixtures/database');

  async.series([
    db.clean,
    db.populate
  ], done);
});
