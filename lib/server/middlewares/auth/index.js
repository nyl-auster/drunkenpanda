'use strict';

var _ = require('lodash');
var async = require('async');
var session = require('express-session');
var passport = require('passport');
var RedisStore = require('connect-redis')(session);
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');
var config = require('../../../services/config');
var error = require('../../../services/error');
var User = require('../../../models/user');

/**
 * Expose middleware.
 */

module.exports = auth;

/**
 * Configure passport.
 */

passport.use(localStrategy());
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

/**
 * Auth middleware.
 */

function auth(req, res, next) {
  async.series([
    _.partial(cookieParser(), req, res),
    _.partial(session({
      store: new RedisStore(config.get('session:redis')),
      resave: false,
      saveUninitialized: true,
      secret: config.get('session:secret')
    }), req, res),
    _.partial(passport.initialize(), req, res),
    _.partial(passport.session(), req, res)
  ], next);
}

/**
 * Create a passport local strategy.
 */

function localStrategy() {
  return new LocalStrategy({
    usernameField: 'email'
  }, function (email, password, next) {
    async.waterfall([
      function fechUser(next) {
        User.where({email: email}, function (err, users) {
          if (err) return next(err);
          if (!users.length) return next(error('auth:unknownUser'));
          next(null, users[0]);
        });
      },
      function validatePassword(user, next) {
        bcrypt.compare(password, user.passwordHash, function(err, valid) {
          if (err) return next(err);
          if (!valid) return next(error('auth:invalidPassword'));

          next(null, user);
        });
      }
    ], next);
  });
}

/**
 * Serialize user.
 */

function serializeUser(user, cb) {
  cb(null, user.id);
}

/**
 * Deserialize user.
 */

function deserializeUser(userId, cb) {
  User.find(userId, cb);
}
