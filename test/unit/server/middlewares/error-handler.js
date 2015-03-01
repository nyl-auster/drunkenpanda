'use strict';

var _ = require('lodash');
var express = require('express');
var request = require('supertest');
var proxyquire = require('proxyquire');

describe('server.middlewares.errorHandler', function () {
  var app;

  var errorMock = function (key) {
    function CustomError() {}

    return _.extend(new CustomError (), {
      'http:internalServerError': {
        code: 'http:internalServerError',
        message: 'Internal server error.',
        status: 500
      },
      'known:error': {
        code: 'known:error',
        message: 'Known error.',
        status: 400
      }
    }[key]);
  };

  errorMock.constructorName = 'CustomError';

  beforeEach(function () {
    var errorHandler = proxyquire(LIB_PATH + '/server/middlewares/error-handler', {
      '../../services/error': errorMock
    });

    app = express();

    app.get('/known-error', function (req, res, next) {
      next(errorMock('known:error'));
    });

    app.get('/unknown-error', function (req, res, next) {
      next(new Error('An unknown error.'));
    });

    app.get('/throwed-error', function (req, res, next) {
      /* jshint unused:false */
      throw new Error('An unknown error.');
    });

    app.use(errorHandler);
  });

  describe('known error', function () {
    it('should return the error with correct status', function (done) {
      request(app)
      .get('/known-error')
      .expect(400, {
        error: {
          code: 'known:error',
          message: 'Known error.'
        }
      })
      .end(done);
    });
  });

  describe('unknown error', function () {
    it('should return the default error', function (done) {
      request(app)
      .get('/unknown-error')
      .expect(500, {
        error: {
          code: 'http:internalServerError',
          message: 'Internal server error.'
        }
      })
      .end(done);
    });
  });

  describe('throwed error', function () {
    it('should return the default error', function (done) {
      request(app)
      .get('/throwed-error')
      .expect(500, {
        error: {
          code: 'http:internalServerError',
          message: 'Internal server error.'
        }
      })
      .end(done);
    });
  });
});
