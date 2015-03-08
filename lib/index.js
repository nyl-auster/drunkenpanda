'use strict';

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var logger = require('./services/logger');

if (cluster.isMaster) {
  // Exit master if something very bad happens to him so that workers also
  // exits and we restart everything
  process.on('uncaughtException', function () {
    process.nextTick(process.exit.bind(process, 1));
  });

  // Fork workers.
  for (var i = 0; i < numCPUs; i++) cluster.fork({ job: 'web-server' });

  cluster.fork({ job: 'search-indexer' });

  cluster.on('exit', function(/*worker, code, signal*/) {
    logger.error('Worker died, restarting it.');
    cluster.fork();
  });
} else {
  switch (process.env.job) {
    case 'web-server':
      require('./server').start();
      break;

    case 'search-indexer':
      require('./search-indexer').listen();
      break;
  }

  // Exit if master died
  process.addListener('disconnect', function () {
    process.nextTick(process.exit.bind(process, 1));
  });
}
