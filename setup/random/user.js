'use strict';

var _ = require('lodash');
var async = require('async');
var chance = new require('chance')();
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');

module.exports = function randomUser(cb) {
  var password = chance.word();

  async.waterfall([
    bcrypt.genSalt,
    _.partial(bcrypt.hash, password),
    function (passwordHash, next) {
      next(null, {
        __labels: ['User'],
        uuid: uuid.v1(),
        email: chance.email(),
        name: [chance.first(), chance.last()].join(' '),
        password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
        __password: password
      });
    }
  ], cb);
};
