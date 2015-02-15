'use strict';

var _ = require('lodash');
var async = require('async');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');
var config = require('../../../services/config');
var error = require('../../../services/error');
var db = require('../../../services/database');
var sessionStore = require('./session-store');

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
      store: sessionStore,
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
        db.readNodesWithLabelsAndProperties('User', { email: email }, next);
      },
      function validatePassword(users, next) {
        var user = users[0];

        if (!user) return next(error('auth:unknownUser'));

        bcrypt.compare(password, user.password, function(err, valid) {
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
  cb(null, user._id);
}

/**
 * Deserialize user.
 */

function deserializeUser(userId, cb) {
  db.readNodeWithLabel(userId, 'User', cb);
}
