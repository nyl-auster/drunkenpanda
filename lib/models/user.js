'use strict';

var async = require('async');
var bcrypt = require('bcrypt');
var db = require('../services/database');
var error = require('../services/error');
var factory = require('./factory')({ label: 'User' });

/**
 * Expose module.
 */


module.exports = {
  find: factory.find,
  findAll: factory.findAll,
  findByEmail: findByEmail,
  create: create,
  update: factory.update,
  destroy: factory.destroy
};

/**
 *
 */

function create(data, cb) {
  if (!data.email) return cb(error('user:invalidEmail'));
  if (!data.password) return cb(error('user:invalidPassword'));

  async.waterfall([
    function (next) {
      bcrypt.genSalt(10, next);
    },
    function (salt, next) {
      bcrypt.hash(data.password, salt, next);
    },
    function (hashedPassword, next) {
      data.password = hashedPassword;
      next();
    }
  ], function () {
    factory.create(data, cb);
  });
}

/**
 *
 */

function findByEmail(email, cb) {
  var query = [
    'MATCH (n:User { email: {email} })',
    'RETURN n'
  ].join('\n');

  db.cypher({
    query: query,
    params: {
      email: email
    }
  }, function (err, results) {
    if (err) return cb(err);
    if (!results.length) return cb(error('user:notFound'));

    cb(null, results[0].n.properties);
  });
}
