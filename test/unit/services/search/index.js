'use strict';

var db = require(LIB_PATH + '/services/database').db;
var search = require(LIB_PATH + '/services/search');
var searchIndexer = require(LIB_PATH + '/search-indexer');
var config = require(LIB_PATH + '/services/config');
var model = require('seraph-model');

describe('services.search', function () {
  beforeEach(function () {
    sinon.stub(searchIndexer, 'index');
  });

  afterEach(function () {
    searchIndexer.index.restore();
  });

  describe('#indexModel', function () {
    it('should send model without compositions to indexer', function (done) {
      var Beer = model(db, 'Beer');
      var Hop = model(db, 'Hop');

      Beer.compose(Hop, 'hops', 'contains_hop');

      Beer.save({
        name: 'Orval',
        hops: [{ name: 'Strisselspalt' }]
      }, function (err, res) {
        if (err) return done(err);
        search.indexModel(Beer, res);

        expect(searchIndexer.index).to.have.been.calledWith({
          index: config.get('elasticsearch:index'),
          type: 'Beer',
          id: res.id,
          body: {
            id: res.id,
            name: 'Orval'
          }
        });
        done();
      });
    });
  });
});
