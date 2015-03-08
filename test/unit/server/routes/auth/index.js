'use strict';

var express = require('express');
var request = require('supertest');
var auth = require(LIB_PATH + '/server/routes/auth');
var authMiddleware = require(LIB_PATH + '/server/middlewares/auth');
var errorHandler = require(LIB_PATH + '/server/middlewares/error-handler');
var User = require(LIB_PATH + '/models/user');

describe('server.routes.auth', function () {
  var app;
  var sessionDestroySpy;
  var user;
  var password = 'hello';

  beforeEach(function (done) {
    User.save({
      email: 'test@example.com',
      name: 'Drunken Panda',
      password: password
    }, function (err, res) {
      if (err) return done(err);

      user = res;
      done();
    });
  });

  beforeEach(function () {
    app = express();

    app.use(authMiddleware);

    app.use(function (req, res, next) {
      sessionDestroySpy = sinon.spy(req.session, 'destroy');
      next();
    });

    app.use(auth);
    app.use(errorHandler);
  });

  describe('/login', function () {
    describe('#POST', function () {
      it('should authenticate user', function (done) {
        request(app)
        .post('/login')
        .send({
          email: user.email,
          password: password
        })
        .expect(200, user)
        .end(done);
      });

      it('return an error with wrong login', function (done) {
        request(app)
        .post('/login')
        .send({
          email: 'unknown.user@example.com',
          password: password
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

  describe('/me', function () {
    describe('#GET', function () {
      describe('with unauthenticated user', function () {
        it('should return an error', function (done) {
          request(app)
          .get('/me')
          .expect(401, {
            error: {
              code: 'auth:notLoggedIn',
              message: 'User not logged in.'
            }
          })
          .end(done);
        });
      });

      describe('with authenticated user', function () {
        var agent;

        beforeEach(function (done) {
          agent = request.agent(app);

          agent
          .post('/login')
          .expect(200)
          .send({
            email: user.email,
            password: password
          })
          .end(done);
        });

        it('should return the current user', function (done) {
          agent
          .get('/me')
          .expect(200, user)
          .end(done);
        });
      });
    });
  });
});
