'use strict';

var _ = require('lodash');
var async = require('async');
var datas = require('./database.json');

async.parallel(_.map(datas, function (modelDatas, modelName) {
  return function (callback) {
    async.each(modelDatas, function (modelData, next) {
      require('../lib/models/' + modelName).save(modelData, next);
    }, callback);
  };
}), process.exit.bind(process));
