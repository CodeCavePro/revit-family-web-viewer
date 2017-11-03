var gulp = require('gulp');
var bro = require('gulp-bro');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts', function() {
    var tsResult = gulp.src("./src/**/*.ts")
        .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
        .pipe(tsProject());
 
    return tsResult.js
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('browserify',  function() {
    gulp.src('./dist/js/index.js')
    .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
    .pipe(bro())
    .pipe(rename('main.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', ['scripts', 'browserify'], function() {
    gulp.watch('./src/*.ts', ['scripts', 'browserify']);
});

gulp.task('default', ['scripts', 'browserify'], function() {
    // Just build scripts and run browserify
});
