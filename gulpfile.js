'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

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
 * Lint JS files.
 */

gulp.task('lint', function() {
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

/**
 * Run tests.
 */

gulp.task('test:db:start', function (done) {
  exec('./node_modules/.bin/neo4j-test -r', done);
});

gulp.task('test:db:stop', function (done) {
  exec('./node_modules/.bin/neo4j-test -k', done);
});

gulp.task('test:run', function() {
  return gulp.src('test/**/*.js')
  .pipe(require('gulp-mocha')({
    reporter: 'spec'
  }));
});

gulp.task('test', function (done) {
  runSequence(
    'test:db:start',
    'test:run',
    'test:db:stop',
    done
  );
});

gulp.task('test:watch', ['test:db:start'], function() {
  return gulp.watch([
    'lib/**/*.js',
    'test/**/*.js'
  ], ['test:run']);
});

/**
 * Bump version.
 */

gulp.task('bump:major', function(){
  gulp.src(['./package.json'])
  .pipe(require('gulp-bump')({type:'major'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function(){
  gulp.src(['./package.json'])
  .pipe(require('gulp-bump')({type:'minor'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:patch', function(){
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
