var gulp = require('gulp');
var bro = require('gulp-bro');
var scss = require('gulp-sass');
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
        .pipe(gulp.dest('./dist/'));
});

gulp.task('js-minify', [ 'js-bundle-demo' ], function (cb) {

    gulp.src([
        './dist/**/*.js',
        '!./dist/**/*.min.js'
    ])
        .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'));
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


gulp.task('js-bundle-demo', [ 'ts-scripts' ], function() {
    gulp.src('./dist/demo.js')
        .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
        .pipe(bro())
        .pipe(rename('bundle.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./demo/js'));
});

gulp.task('watch', [ 'js-minify', 'css-minify', 'js-bundle-demo' ], function() {
    gulp.watch('./src/*.ts', [ 'js-minify' ]);
    gulp.watch('./src/*.scss', [ 'css-minify' ]);
});

gulp.task('default', [ 'js-minify', 'css-minify' ], function() {
    // Production-ready build
});
