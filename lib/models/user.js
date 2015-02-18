'use strict';

var _ = require('lodash');
var async = require('async');
var model = require('seraph-model');
var db = require('../services/database').db;
var bcrypt = require('bcrypt');

/**
 * Expose model.
 */

var User = module.exports = model(db, 'User');

/**
 * Schema.
 */

User.schema = {
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String }
};

User.setUniqueKey('email');

/**
 * Hash password.
 */

User.on('prepare', function (user, callback) {
  async.waterfall([
    bcrypt.genSalt,
    _.partial(bcrypt.hash, user.password)
  ], function (err, hashedPassword) {
    if (err) return callback(err);
    user.password = hashedPassword;
    callback(null, user);
  });
});
