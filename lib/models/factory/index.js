'use strict';

var _ = require('lodash');
var _s = require('underscore.string');
var uuid = require('node-uuid');
var db = require('../../services/database');
var error = require('../../services/error');

/**
 * Expose factory.
 */

module.exports = factory;

function factory (options) {

  return {
    find: function (uuid, cb) {
      var query = [
        'MATCH (n:' + options.label + ' { uuid: {uuid} })',
        'RETURN n'
      ].join('\n');

      db.cypher({
        query: query,
        params: {
          uuid: uuid
        }
      }, function (err, results) {
        if (err) return cb(err);
        if (!results.length) return cb(getError('notFound'));

        cb(null, results[0].n.properties);
      });
    },

    findAll: function (cb) {
      var query = [
        'MATCH (n:' + options.label + ')',
        'RETURN n'
      ].join('\n');

      db.cypher({
        query: query
      }, function (err, results) {
        if (err) return cb(err);

        cb(null, _.map(results || [], function (result) {
          return result.n.properties;
        }));
      });
    },

    create: function (data, cb) {
      var query = [
        'CREATE (n:' + options.label + ' {data})',
        'RETURN n'
      ].join('\n');

      db.cypher({
        query: query,
        params: {
          data: _.merge(data, { uuid: uuid.v1() })
        }
      }, function (err, results) {
        if (err) return cb(err);

        cb(null, results[0].n.properties);
      });
    },

    update: function(uuid, data, cb) {
      var query = [
        'MATCH (n:' + options.label + ' { uuid: {uuid} })',
        'SET n = {data}',
        'RETURN n'
      ].join('\n');

      db.cypher({
        query: query,
        params: {
          uuid: uuid,
          data: _.merge(data, { uuid: uuid })
        }
      }, function (err, results) {
        if (err) return cb(err);
        if (!results.length) return cb(getError('notFound'));

        cb(null, results[0].n.properties);
      });
    },

    destroy: function(uuid, cb) {
      var query = [
        'MATCH (n:' + options.label + ' { uuid: {uuid} })',
        'DELETE n'
      ].join('\n');

      db.cypher({
        query: query,
        params: {
          uuid: uuid
        }
      }, cb);
    }
  };

  function getError(errorType) {
    return error([
      _s.decapitalize(options.label),
      errorType
    ].join(':'));
  }
}
