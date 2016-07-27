'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
  
  config = {
    dir: 'node_modules/'
  },

  vendorCSS   = [
    config.dir + 'bootstrap/dist/css/bootstrap.min.css',
    config.dir + 'font-awesome/css/font-awesome.min.css',
    ],

  vendorJS  = [
    config.dir + 'core-js/client/shim.min.js',
    config.dir + 'zone.js/dist/zone.js',
    config.dir + 'reflect-metadata/Reflect.js',
    config.dir + 'systemjs/dist/system.src.js',
  ],

  vendorFonts = [
    config.dir + 'font-awesome/fonts/**.*',
    config.dir + 'bootstrap/fonts/**.*'];

gulp.task('vendor_styles', function() {
  return gulp.src(vendorCSS)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('public/assets/css'));
});

gulp.task('vendor_fonts', function() {
  return gulp.src(vendorFonts)
    .pipe(gulp.dest('public/assets/fonts'));
});

/*
gulp.task('vendor_scripts', function() {
  return gulp.src(vendorJS)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/assets/js'));
});
*/

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:4000",
    files: ["public/**/*.*"],
    browser: "google chrome",
    port: 5000,
  });
});

gulp.task('nodemon', function (cb) {
  
  var started = false;
  
  return nodemon({
    script: 'server.js'
  }).on('start', function () {
    if (!started) {
      cb();
      started = true; 
    } 
  });
});

gulp.task('default', [ 
  'vendor_styles', 
  'vendor_fonts',
  'browser-sync'
]);


