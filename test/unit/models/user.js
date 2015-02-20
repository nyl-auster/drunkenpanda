'use strict';

var _ = require('lodash');
var User = require(LIB_PATH + '/models/user');
var error = require(LIB_PATH + '/services/error');

describe('models.user', function () {
  var user;

  beforeEach(function (done) {
    User.save({
      name: 'Drunken Panda',
      email: 'test@example.fr',
      password: 'hello'
    }, function (err, res) {
      if (err) return done(err);
      user = res;
      done();
    });
  });

  describe('#save', function () {
    describe('create', function () {
      it('should create a user', function (done) {
        User.save({
          name: 'Master of the pandas',
          email: 'test-new@example.com',
          password: 'hello'
        }, function (err, res) {
          if (err) return done(err);
          expect(res).to.have.property('name', 'Master of the pandas');
          done();
        });
      });

      describe('without password', function () {
        it('should return an error', function (done) {
          User.save({
            name: 'Drunken Panda',
            email: 'test-new@example.fr'
          }, function (err) {
            expect(err).to.eql(error('user:invalidPassword'));
            done();
          });
        });
      });

      describe('with an already registered email', function () {
        it('should return an error', function (done) {
          User.save({
            name: 'Drunken Panda',
            email: 'test@example.fr',
            password: 'hello'
          }, function (err) {
            expect(err).to.not.be.null;
            done();
          });
        });
      });
    });

    describe('update', function () {
      it('should update a user', function (done) {
        User.save(_.merge(user, {
          name: 'Master of the pandas'
        }), function (err, res) {
          if (err) return done(err);
          expect(res).to.have.property('name', 'Master of the pandas');
          done();
        });
      });

      describe('with password', function () {
        it('should recreate password hash', function (done) {
          User.save(_.chain(user).merge({
            password: 'new password'
          }).omit('passwordHash').value(), function (err, res) {
            if (err) return done(err);
            expect(res.passwordHash).to.not.eql(user.passwordHash);
            done();
          });
        });
      });

      describe('without password nor password hash', function () {
        it('should return an error', function (done) {
          User.save(_.omit(user, 'passwordHash'), function (err) {
            expect(err).to.eql(error('user:missingPasswordHash'));
            done();
          });
        });
      });

      describe('with an already registered email', function () {
        var user2;

        beforeEach(function (done) {
          User.save({
            name: 'Drunken Panda #2',
            email: 'test2@example.fr',
            password: 'hello'
          }, function (err, res) {
            if (err) return done(err);
            user2 = res;
            done();
          });
        });

        it('should return an error', function (done) {
          User.save(_.merge(user2, {
            email: 'test@example.fr'
          }), function (err) {
            expect(err).to.not.be.null;
            done();
          });
        });
      });
    });
  });
});
