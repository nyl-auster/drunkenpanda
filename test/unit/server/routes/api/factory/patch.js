'use strict';

var request = require('supertest');
var express = require('express');
var model = require('seraph-model');
var db = require(LIB_PATH + '/services/database').db;
var patch = require(LIB_PATH + '/server/routes/api/factory/patch');

var TestModel = model(db, 'Test');

describe('server.routes.api.factory.patch', function () {
  var app;
  var resource;

  beforeEach(function (done) {
    app = express();
    app.use(patch({
      model: TestModel
    }));

    TestModel.save({ foo: 'bar' }, function (err, res) {
      if (err) return done(err);
      resource = res;
      done();
    });
  });

  describe('#PATCH', function () {
    it('should patch a resource', function (done) {
      request(app)
      .patch('/' + resource.id)
      .send({ id: resource.id, bar: 'baz' })
      .expect(200, { id: resource.id, foo: 'bar', bar: 'baz' })
      .end(function (err, res) {
        if (err) return done(err);

        TestModel.read(res.body.id, function (err, result) {
          if (err) return done(err);

          expect(result).to.eql({ id: res.body.id, foo: 'bar', bar: 'baz' });
          done();
        });
      });
    });

    it('should ignore id modification', function (done) {
      request(app)
      .patch('/' + resource.id)
      .send({ id: 123, bar: 'baz' })
      .expect(200, { id: resource.id, foo: 'bar', bar: 'baz' })
      .end(function (err, res) {
        if (err) return done(err);

        TestModel.read(res.body.id, function (err, result) {
          if (err) return done(err);

          expect(result).to.eql({ id: res.body.id, foo: 'bar', bar: 'baz' });
          done();
        });
      });
    });

    it('should return 404 if resource doesn\'t exists', function (done) {
      var id = resource.id + 1;

      request(app)
      .patch('/' + id)
      .send({ id: id, bar: 'baz' })
      .expect(404)
      .end(done);
    });
  });
});
