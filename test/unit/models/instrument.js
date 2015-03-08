'use strict';

var proxyquire = require('proxyquire');

describe('models.instrument', function () {
  var searchMock = {
    indexModel: sinon.spy()
  };

  var Instrument = proxyquire(LIB_PATH + '/models/instrument', {
    '../services/search': searchMock
  });

  describe('#save', function () {
    it('should index instrument', function (done) {
      Instrument.save({
        name: 'Piano'
      }, function (err, res) {
        if (err) return done(err);

        expect(searchMock.indexModel).to.have.been.calledWith(Instrument, res);
        done();
      });
    });
  });
});
