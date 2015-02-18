'use strict';

var request = require('supertest');
var express = require('express');
var model = require('seraph-model');
var db = require(LIB_PATH + '/services/database').db;
var find = require(LIB_PATH + '/server/routes/api/factory/find');

var TestModel = model(db, 'Test');

describe('server.routes.api.factory.find', function () {
  var app;
  var resource;

  beforeEach(function (done) {
    app = express();
    app.use(find({
      model: TestModel
    }));

    TestModel.save({ foo: 'bar' }, function (err, res) {
      if (err) return done(err);
      resource = res;
      done();
    });
  });

  describe('#GET', function () {
    it('should return a resource', function (done) {
      request(app)
      .get('/' + resource.id)
      .expect(200, { id: resource.id, foo: 'bar' })
      .end(done);
    });

    it('should return 404 if resource doesn\'t exists', function (done) {
      var id = resource.id + 1;

      request(app)
      .get('/' + id)
      .expect(404)
      .end(done);
    });
  });
});
