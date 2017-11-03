var gulp = require('gulp');
var bro = require('gulp-bro');
var scss = require('gulp-scss');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify-es').default;
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

gulp.task('browserify', [ 'ts-scripts' ], function() {
    gulp.src('./dist/js/index.js')
        .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
        .pipe(bro())
        .pipe(rename('main.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('js-minify', [ 'browserify' ], function (cb) {

     gulp.src('./dist/js/main.js')
        .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('scss', function () {
    gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init({largeFile: true, loadMaps: false}))
        .pipe(scss({
            // "bundleExec": true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('css-minify', [ 'scss' ], function () {

    gulp.src([
            './dist/css/**/*.css',
            '!./dist/css/**/*.min.css'
        ])
        .pipe(sourcemaps.init({largeFile: true, loadMaps: false}))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('fast-build', [ 'browserify', 'scss' ], function() {
    // Faster build
});

gulp.task('watch', [ 'js-minify', 'css-minify' ], function() {
    gulp.watch('./src/*.ts', [ 'js-minify' ]);
    gulp.watch('./src/*.scss', [ 'css-minify' ]);
});

gulp.task('default', [ 'js-minify', 'css-minify' ], function() {
    // Production-ready build
});
