var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    tsProject = ts.createProject('tsconfig.json'),
    sourcemaps = require('gulp-sourcemaps');


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


gulp.task('watch', [ 'ts-scripts' ], function() {
    gulp.watch('./src/*.ts', [ 'ts-scripts' ]);
});


gulp.task('default', [ 'ts-scripts' ], function() {
    // Production-ready build
});
