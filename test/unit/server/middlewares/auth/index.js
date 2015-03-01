'use strict';

var express = require('express');
var request = require('supertest');
var passport = require('passport');
var bodyParser = require('body-parser');
var auth = require(LIB_PATH + '/server/middlewares/auth');
var User = require(LIB_PATH + '/models/user');

describe('server.middlewares.auth', function () {
  var app;

  beforeEach(function (done) {
    app = express();

    app.use(auth);

    app.post('/login', bodyParser.json(), function (req, res, next) {
      passport.authenticate('local', function (err, user, info) {
        if (err) return next(err);
        if (!user) return next(info);

        req.login(user, function (err) {
          if (err) return next(err);

          res.send(user);
        });
      })(req, res, next);
    });

    app.get('/protected', function (req, res) {
      res.status(req.user ? 200 : 401).send();
    });

    User.save({
      name: 'Drunken Panda',
      email: 'test@example.com',
      password: 'hello'
    }, done);
  });

  describe('with valid user/password', function () {
    it('should accept login', function (done) {
      request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'hello'
      })
      .expect(200)
      .end(done);
    });
  });

  describe('with invalid user', function () {
    it('should reject login', function (done) {
      request(app)
      .post('/login')
      .send({
        email: 'wrong-login@example.com',
        password: 'hello'
      })
      .expect(401)
      .end(done);
    });
  });

  describe('with invalid password', function () {
    it('should reject login', function (done) {
      request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'wrong password'
      })
      .expect(401)
      .end(done);
    });
  });

  describe('protected route', function () {
    describe('without authenticated user', function () {
      it('should reject request', function (done) {
        request(app)
        .get('/protected')
        .expect(401)
        .end(done);
      });
    });

    describe('with authenticated user', function () {
      var agent;
      beforeEach(function (done) {
        agent = request.agent(app);

        agent
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'hello'
        })
        .expect(200)
        .end(done);
      });

      it('should allow request', function (done) {
        agent
        .get('/protected')
        .expect(200)
        .end(done);
      });
    });
  });
});
