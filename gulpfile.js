'use strict';

var gulp = require('gulp');

/**
 * Run server.
 */

gulp.task('server', function () {
  require('gulp-nodemon')({
    script: 'lib/index',
    watch: [
      'config/config.json',
      'config/config.' + process.env.NODE_ENV + '.json',
      'lib/**/*.js'
    ]
  });
});

/**
 * Database tasks.
 */

gulp.task('db:clean', function (done) {
  require('./lib/services/database').clean(done);
});

gulp.task('db:populate', ['db:clean'], function (done) {
  require('child_process').fork('./setup').once('exit', done);
});

gulp.task('db:populate:random', ['db:clean'], function (done) {
  require('child_process').fork('./setup/random').once('exit', done);
});

/**
 * Lint JS files.
 */

gulp.task('lint', function () {
  var jshint = require('gulp-jshint');

  return gulp.src([
    './gulpfile.js',
    './lib/**/*.js',
    './test/**/*.js'
  ])
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'));
});

gulp.task('lint:watch', function () {
  return gulp.watch([
    './gulpfile.js',
    './lib/**/*.js',
    './test/**/*.js'
  ], ['lint']);
});

/**
 * Run tests.
 */

gulp.task('test:db:start', function (done) {
  exec('./node_modules/.bin/neo4j-test -r', done);
});

gulp.task('test:db:stop', function (done) {
  exec('./node_modules/.bin/neo4j-test -k', done);
});

gulp.task('test', function () {
  return gulp.src('test/unit/**/*.js')
  .pipe(require('gulp-spawn-mocha')({
    reporter: 'nyan',
    growl: true
  }));
});

gulp.task('test:watch', ['test:db:start'], function () {
  return gulp.watch([
    'lib/**/*.js',
    'test/unit/**/*.js'
  ], ['test']);
});

gulp.task('test:coverage', ['test:db:start'], function () {
  return gulp.src('test/unit/**/*.js')
  .pipe(require('gulp-spawn-mocha')({
    reporter: 'nyan',
    istanbul: {
      dir: './.coverage'
    }
  }));
});

/**
 * Bump version.
 */

gulp.task('bump:major', function (){
  gulp.src(['./package.json'])
  .pipe(require('gulp-bump')({type:'major'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function (){
  gulp.src(['./package.json'])
  .pipe(require('gulp-bump')({type:'minor'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:patch', function (){
  gulp.src(['./package.json'])
  .pipe(require('gulp-bump')({type:'patch'}))
  .pipe(gulp.dest('./'));
});

/**
 * Helper function to exec a command and show output.
 */

function exec(cmd, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  require('child_process').exec(cmd, options, function (err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  });
}
