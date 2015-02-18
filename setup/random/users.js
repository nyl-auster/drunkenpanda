'use strict';

var _ = require('lodash');
var _s = require('underscore.string');
var http = require('http');
var async = require('async');
var User = require('../../lib/models/user');

/**
 * Expose module.
 */

module.exports = function (count, callback) {
  http.get('http://api.randomuser.me/?results=' + count, function (response) {
    var datas = '';

    response.on('data', function (chunk) {
      datas += chunk;
    });

    response.on('end', function () {
      try {
        datas = JSON.parse(datas);
      } catch (err) {
        return callback(err);
      }

      async.each(datas.results, function (data, next) {
        User.save({
          email: data.user.email,
          name: _.map([
            data.user.name.first,
            data.user.name.last
          ], _s.capitalize).join(' '),
          password: data.user.password
        }, next);
      }, callback);
    });
  }).on('error', callback);
};
