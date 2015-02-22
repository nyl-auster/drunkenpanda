'use strict';

var express = require('express');
var childProcess = require('child_process');
var packageInfo = require('../../../../package.json');

/**
 * Expose module.
 */

var app = module.exports = new express.Router();

/**
 * Routes.
 */

app.get('/', function (req, res, next) {
  getHeadCommit(function (err, commit) {
    if (err) return next(err);

    res.send({
      environment: process.env.NODE_ENV,
      version: packageInfo.version,
      headCommit: commit.replace(/\s+/, '')
    });
  });
});

/**
 * Return the head commit.
 */

function getHeadCommit(cb) {
  childProcess.exec('git rev-parse HEAD', cb);
}
