var gulp = require('gulp'),
    bro = require('gulp-bro'),
    scss = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    buffer = require('vinyl-buffer');


gulp.task('js-bundle', [
    'js-bundle-es6',
    'js-bundle-commonjs'
]);


gulp.task('js-bundle-es6', function() {
    return browserify(['./src/demo.es6'])
        .transform(babelify, {
            presets: [
                "@babel/preset-env"
            ]
        })
        .bundle()
        .pipe(source('demo.es6.bundled.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(buffer());
});


gulp.task('js-bundle-commonjs', function() {
    return gulp.src('./src/demo.js')
        .pipe(bro())
        .pipe(rename({
            suffix: ".bundled",
        }))
        .pipe(gulp.dest('./dist/js'));
});


gulp.task('scss-compile', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sourcemaps.init({largeFile: true, loadMaps: false}))
        .pipe(scss({
            // "bundleExec": true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css'));
});


gulp.task('css-minify', [ 'scss-compile' ], function () {
    return gulp.src([
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


gulp.task('watch', [ 'css-minify', 'js-bundle' ], function() {
    gulp.watch('./scss/*.scss', [ 'css-minify' ]);
    gulp.watch('./src/*.js', [ 'js-bundle' ]);
});


gulp.task('default', [ 'css-minify', 'js-bundle' ]);
