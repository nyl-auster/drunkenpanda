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
        var query = [
          'MATCH (n:User)',
          'WHERE n.email = {email}',
          'RETURN n'
        ].join('\n');

        db.cypher({
          query: query,
          params: {
            email: email
          }
        }, function (err, results) {
          if (err) return next(err);
          if (!results.length) return next(error('auth:unknownUser'));

          next(null, results[0].n.properties);
        });
      },
      function validatePassword(user, next) {
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
  cb(null, user.uuid);
}

/**
 * Deserialize user.
 */

function deserializeUser(uuid, cb) {
  var query = [
    'MATCH (n:User)',
    'WHERE n.uuid = {uuid}',
    'RETURN n'
  ].join('\n');

  db.cypher({
    query: query,
    params: {
      uuid: uuid
    }
  }, function (err, results) {
    if (err) return cb(err);
    if (!results.length) return cb(error('auth:unknownUser'));

    cb(null, results[0].n.properties);
  });
}
