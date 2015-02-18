'use strict';

var request = require('supertest');
var express = require('express');
var model = require('seraph-model');
var db = require(LIB_PATH + '/services/database').db;
var destroy = require(LIB_PATH + '/server/routes/api/factory/destroy');

var TestModel = model(db, 'Test');

describe('server.routes.api.factory.destroy', function () {
  var app;
  var resource;

  beforeEach(function (done) {
    app = express();
    app.use(destroy({
      model: TestModel
    }));

    TestModel.save({ foo: 'bar' }, function (err, res) {
      if (err) return done(err);
      resource = res;
      done();
    });
  });

  describe('#DELETE', function () {
    it('should delete a resource', function (done) {
      request(app)
      .delete('/' + resource.id)
      .expect(204)
      .end(function (err) {
        if (err) return done(err);

        TestModel.read(resource.id, function (err, result) {
          if (err) return done(err);

          expect(result).to.be.false;
          done();
        });
      });
    });

    it('should return 404 if resource doesn\'t exists', function (done) {
      request(app)
      .delete('/' + resource.id + 1)
      .expect(404)
      .end(done);
    });
  });
});
