var gulp = require('gulp'),
    bro = require('gulp-bro'),
    scss = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify-es').default,
    rename = require('gulp-rename'),
    ts = require('gulp-typescript'),
    tsProject = ts.createProject('tsconfig.json'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    buffer = require('vinyl-buffer');

gulp.task('ts-scripts', [ 'ts-scripts-es6', 'ts-scripts-commonjs' ]);

gulp.task('ts-scripts-es6', function() {
    var tsConfig = tsProject.config.compilerOptions;
    tsConfig.module = 'es6'; // force module type = 'es6'
    var tsResult = gulp.src("./src/**/*.ts")
        .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
        .pipe(ts(tsConfig));

    return tsResult.js
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/es6'));
});

gulp.task('ts-scripts-commonjs', function() {
    var tsConfig = tsProject.config.compilerOptions;
    tsConfig.module = 'commonjs'; // force module type = 'commonjs'
    var tsResult = gulp.src("./src/**/*.ts")
        .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
        .pipe(ts(tsConfig));

    return tsResult.js
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/commonjs'));
});

gulp.task('js-demo-bundle', [ 'ts-scripts' ], function() {
    browserify(['./demo/src/demo.es6'])
        .transform(babelify)
        .bundle()
        .pipe(source('demo.es6.bundled.js'))
        .pipe(gulp.dest('demo/js'))
        .pipe(buffer());

    gulp.src('./demo/src/demo.js')
        .pipe(bro())
        .pipe(rename({
            suffix: ".bundle",
        }))
        .pipe(gulp.dest('./demo/js'));
});

gulp.task('scss-compile', function () {
    gulp.src('./scss/**/*.scss')
        .pipe(sourcemaps.init({largeFile: true, loadMaps: false}))
        .pipe(scss({
            // "bundleExec": true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./demo/css'));
});

gulp.task('css-minify', [ 'scss-compile' ], function () {
    gulp.src([
            './demo/css/**/*.css',
            '!./demo/css/**/*.min.css'
        ])
        .pipe(sourcemaps.init({largeFile: true, loadMaps: false}))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./demo/css'));
});

gulp.task('watch', [ 'css-minify', 'js-demo-bundle' ], function() {
    gulp.watch('./src/*.scss', [ 'css-minify' ]);
});

gulp.task('default', [ 'css-minify', 'js-demo-bundle' ], function() {
    // Production-ready build
});
