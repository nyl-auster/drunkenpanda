'use strict';

var gulp = require('gulp');

/**
 * Run server.
 */

gulp.task('server', function () {
  require('gulp-nodemon')({
    script: 'lib/index',
    watch: [
      'config/**/*.json',
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

gulp.task('test', function() {
  return gulp.src('test/**/*.js')
  .pipe(require('gulp-mocha')({
    reporter: 'spec'
  }));
});

gulp.task('test:watch', function() {
  return gulp.watch([
    'lib/**/*.js',
    'test/**/*.js'
  ], ['test']);
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
