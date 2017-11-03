var gulp = require('gulp');
var bro = require('gulp-bro');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('ts-scripts', function() {
    var tsResult = gulp.src("./src/**/*.ts")
        .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
        .pipe(tsProject());
 
    return tsResult.js
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('browserify', ['ts-scripts'], function() {
    gulp.src('./dist/js/index.js')
    .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
    .pipe(bro())
    .pipe(rename('main.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', ['browserify'], function() {
    gulp.watch('./src/*.ts', ['browserify']);
});

gulp.task('default', ['browserify'], function() {
    // Just build ts-scripts and run browserify
});
