'use strict';

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var server = require('./server');
var logger = require('./services/logger');

if (cluster.isMaster) {
  // Exit master if something very bad happens to him so that workers also
  // exits and we restart everything
  process.on('uncaughtException', function () {
    process.nextTick(process.exit.bind(process, 1));
  });

  // Fork workers.
  for (var i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on('exit', function(/*worker, code, signal*/) {
    logger.error('Worker died, restarting it.');
    cluster.fork();
  });
} else {
  server.start();

  // Exit if master died
  process.addListener('disconnect', function () {
    process.nextTick(process.exit.bind(process, 1));
  });
}
