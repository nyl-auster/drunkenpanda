'use strict';

var express = require('express');
var request = require('supertest');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var auth = require(LIB_PATH + '/server/routes/auth');
var error = require(LIB_PATH + '/services/error');
var errorHandler = require(LIB_PATH + '/server/middlewares/error-handler');

describe('server.routes.auth', function () {
  var app;

  var user = {
    id: 1,
    email: 'test@example.com',
    name: 'Drunken Panda',
    password: 'hello'
  };

  describe('/login', function () {
    beforeEach(function () {
      var strategy = new LocalStrategy({
        usernameField: 'email'
      }, function (email, password, callback) {
        if (email !== user.email)
          return callback(error('auth:unknownUser'));

        if (password !== user.password)
          return callback(error('auth:invalidPassword'));

        callback(null, user);
      });

      passport.use('local', strategy);

      passport.serializeUser(function (user, callback) {
        callback(null, user.id);
      });

      passport.deserializeUser(function (id, callback) {
        callback(null, user);
      });

      app = express();
      app.use(passport.initialize());
      app.use(passport.session());

      app.use(auth);
      app.use(errorHandler);
    });

    describe('#POST', function () {
      it('should authenticate user', function (done) {
        request(app)
        .post('/login')
        .send({
          email: user.email,
          password: user.password
        })
        .expect(200, user)
        .end(done);
      });

      it('return an error with wrong login', function (done) {
        request(app)
        .post('/login')
        .send({
          email: 'unknown.user@example.com',
          password: user.password
        })
        .expect(401, {
          error: {
            code: 'auth:unknownUser',
            message: 'Unknown user.'
          }
        })
        .end(done);
      });

      it('return an error with wrong password', function (done) {
        request(app)
        .post('/login')
        .send({
          email: user.email,
          password: 'wrong password'
        })
        .expect(401, {
          error: {
            code: 'auth:invalidPassword',
            message: 'Invalid password.'
          }
        })
        .end(done);
      });
    });
  });

  describe('/logout', function () {
    var sessionDestroySpy;

    beforeEach(function () {
      app = express();
      sessionDestroySpy = sinon.stub().yields();

      app.use(function (req, res, next) {
        req.session = {
          destroy: sessionDestroySpy
        };
        next();
      });

      app.use(auth);
    });

    describe('#GET', function () {
      it('should destroy the session', function (done) {
        request(app)
        .get('/logout')
        .end(function (err) {
          if (err) return done(err);

          expect(sessionDestroySpy).to.have.been.called;
          done();
        });
      });
    });
  });
});
