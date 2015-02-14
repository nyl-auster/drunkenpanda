
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
