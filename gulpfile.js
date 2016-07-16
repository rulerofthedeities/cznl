var gulp = require('gulp'),
  concat = require('gulp-concat'),
  //sass = require('gulp-sass'),
  //babel = require('gulp-babel'),

  config = {
    dir: 'node_modules/'
  },

  vendorCSS   = [
    config.dir + 'bootstrap/dist/css/bootstrap.min.css',
    config.dir + 'font-awesome/css/font-awesome.min.css',
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


gulp.task('default', [ 
  'vendor_styles', 
  'vendor_fonts'
]);

