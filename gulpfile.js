var gulp        = require('gulp'),
    bro         = require('gulp-bro'),
    scss        = require('gulp-sass'),
    cleanCSS    = require('gulp-clean-css'),
    rename      = require('gulp-rename'),
    sourcemaps  = require('gulp-sourcemaps'),
    babelify    = require('babelify');

gulp.task('js-bundle', [
    'js-bundle-es6',
    'js-bundle-commonjs'
]);


gulp.task('js-bundle-es6', function() {
    return gulp.src('./src/demo.es6')
        .pipe(bro({
            transform: [
                babelify.configure({ presets: [ "@babel/preset-env" ] })
            ]
        }))
        .pipe(rename({
            basename: "demo.es6",
            extname: ".bundled.js",
        }))
        .pipe(gulp.dest('./dist/js'));
});


gulp.task('js-bundle-commonjs', function() {
    return gulp.src('./src/demo.cjs')
        .pipe(bro())
        .pipe(rename({
            basename: "demo.cjs",
            extname: ".bundled.js",
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
