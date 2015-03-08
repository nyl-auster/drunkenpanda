'use strict';

var _ = require('lodash');
var stream = require('stream');
var url = require('url');
var events = require('events');
var proxyquire = require('proxyquire');
var config = require(LIB_PATH + '/services/config');
var error = require(LIB_PATH + '/services/error');
var logger = require(LIB_PATH + '/services/logger');
var search = require(LIB_PATH + '/services/search');

describe('searchIndexer', function () {
  var searchIndexer;
  var pushSocketMock;
  var pullSocketMock;
  var contextMock;
  var rabbitMock;

  beforeEach(function () {
    pushSocketMock = new stream.Writable();
    pushSocketMock._write = function (buffer) { this.write(buffer.toString()); };
    pushSocketMock.write = sinon.spy();
    pushSocketMock.connect = sinon.stub();

    pullSocketMock = new stream.Readable();
    pullSocketMock._read = _.noop;
    pullSocketMock.connect = sinon.stub();
    sinon.stub(pullSocketMock, 'setEncoding');

    contextMock = new events.EventEmitter();
    contextMock.close = sinon.spy();
    contextMock.socket = sinon.spy(function (type) {
      return type === 'PUSH' ? pushSocketMock : pullSocketMock;
    });

    rabbitMock = {
      createContext: sinon.stub().returns(contextMock)
    };

    searchIndexer = proxyquire(LIB_PATH + '/search-indexer', {
      'rabbit.js': rabbitMock
    });

    sinon.stub(logger, 'error');
    sinon.stub(search.client, 'index');
  });

  afterEach(function () {
    logger.error.restore();
    search.client.index.restore();

    process.removeListener('exit', contextMock.close);
  });

  it('create a RabbitMQ connection', function () {
    expect(rabbitMock.createContext).to.have.been.calledWith(url.format(config.get('rabbitmq:server')));
  });

  describe('context ready', function () {
    it('should set ready flag to true', function () {
      expect(searchIndexer.ready).to.be.false;
      contextMock.emit('ready');
      expect(searchIndexer.ready).to.be.true;
    });

    it('should create a PUSH socket connected to `search:indexer` queue', function () {
      expect(contextMock.socket).to.not.have.been.called;
      contextMock.emit('ready');
      expect(contextMock.socket).to.have.been.calledWith('PUSH');
      expect(pushSocketMock.connect).to.have.been.calledWith('search:indexer');
    });
  });

  describe('#index', function () {
    describe('when context is ready', function () {
      beforeEach(function () {
        contextMock.emit('ready');
      });

      it('should push item in queue', function () {
        searchIndexer.index({ foo: 'bar' });
        expect(pushSocketMock.write).to.have.been.calledWith('{"foo":"bar"}');
      });
    });

    describe('when context is not ready', function () {
      it('should wait for context to be ready, then push item in queue', function () {
        searchIndexer.index({ foo: 'bar' });

        expect(pushSocketMock.write).to.not.have.been.called;
        contextMock.emit('ready');
        expect(pushSocketMock.write).to.have.been.calledWith('{"foo":"bar"}');
      });
    });
  });

  describe('#listen', function () {
    describe('when context is ready', function () {
      beforeEach(function () {
        contextMock.emit('ready');
      });

      it('should create a PULL socket connected to `search:indexer` queue', function () {
        searchIndexer.listen();

        expect(contextMock.socket).to.have.been.calledWith('PULL');
        expect(pullSocketMock.connect).to.have.been.calledWith('search:indexer');
        expect(pullSocketMock.setEncoding).to.have.been.calledWith(config.get('rabbitmq:encoding'));
      });

      describe('on data', function () {
        beforeEach(function () {
          searchIndexer.listen();
        });

        describe('malformed JSON', function () {
          it('should log an error', function () {
            pullSocketMock.emit('data', '{foo:bar}');

            expect(logger.error).to.have.been.calledWith(error('search:indexer:invalidJSON'));
            expect(search.client.index).to.not.have.been.called;
          });
        });

        describe('valid JSON', function () {
          it('index data', function () {
            pullSocketMock.emit('data', '{"foo":"bar"}');

            expect(logger.error).to.not.have.been.called;
            expect(search.client.index).to.have.been.calledWith({ foo: 'bar' });
          });
        });
      });
    });

    describe('when context is not ready', function () {
      it('should wait for context to be ready', function () {
        searchIndexer.listen();

        expect(contextMock.socket).to.not.have.been.called;
        expect(pullSocketMock.connect).to.not.have.been.called;
        expect(pullSocketMock.setEncoding).to.not.have.been.called;

        contextMock.emit('ready');

        expect(contextMock.socket).to.have.been.calledWith('PULL');
        expect(pullSocketMock.connect).to.have.been.calledWith('search:indexer');
        expect(pullSocketMock.setEncoding).to.have.been.calledWith(config.get('rabbitmq:encoding'));
      });
    });
  });
});
