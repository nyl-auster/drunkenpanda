'use strict';

var request = require('supertest');
var express = require('express');
var model = require('seraph-model');
var db = require(LIB_PATH + '/services/database').db;
var create = require(LIB_PATH + '/server/routes/api/factory/create');

var TestModel = model(db, 'Test');

describe('server.routes.api.factory.create', function () {
  var app;

  beforeEach(function () {
    app = express();
    app.use(create({
      model: TestModel
    }));
  });

  describe('#POST', function () {
    it('should create a resource', function (done) {
      request(app)
      .post('/')
      .send({ foo: 'bar' })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);

        expect(res.body.id).to.exist;
        expect(res.body.foo).to.equal('bar');

        TestModel.read(res.body.id, function (err, result) {
          if (err) return done(err);

          expect(result).to.eql({ id: res.body.id, foo: 'bar' });
          done();
        });
      });
    });
  });
});
