'use strict';

var express = require('express');
var passport = require('passport');

/**
 * Expose module.
 */

var app = module.exports = new express.Router();

/**
 * Routes.
 */

app.post('/login', login);
app.get('/logout', logout);

/**
 * Login.
 */

function login(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) return next(err);
    if (!user) return next(info);

    req.login(user, function (err) {
      if (err) return next(err);

      res.send(user);
    });
  })(req, res, next);
}

/**
 * Logout.
 */

function logout(req, res, next) {
  req.session.destroy(function (err) {
    if (err) return next(err);

    res.clearCookie('connect.sid');
    res.send();
  });
}
