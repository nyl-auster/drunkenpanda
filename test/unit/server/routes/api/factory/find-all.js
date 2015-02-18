'use strict';

var async = require('async');
var request = require('supertest');
var express = require('express');
var model = require('seraph-model');
var db = require(LIB_PATH + '/services/database').db;
var findAll = require(LIB_PATH + '/server/routes/api/factory/find-all');

var TestModel = model(db, 'Test');

describe('server.routes.api.factory.findAll', function () {
  var app;

  beforeEach(function (done) {
    app = express();
    app.use(findAll({
      model: TestModel
    }));

    async.each([
      { foo: 'bar' },
      { foo: 'baz' }
    ], TestModel.save.bind(TestModel), done);
  });

  describe('#GET', function () {
    it('should return all resources', function (done) {
      request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body).to.have.length(2);
        done();
      });
    });
  });
});
