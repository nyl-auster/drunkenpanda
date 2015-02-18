/* jshint strict: false */

// Force node environment
process.env.NODE_ENV = 'test';

var path = require('path');
LIB_PATH = path.resolve(__dirname, '..', '..', 'lib');

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

afterEach(require(LIB_PATH + '/services/database').clean);
