var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var uglify = require('gulp-uglify');
// var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

// 监控源码更改
var livereload = require('gulp-livereload');

var paths = {
    pages: ['src/*.html'],
    css: ['src/*.css'],
    ts: ['src/ts/*.ts']
};

gulp.task('tsc', function () {
    browserify({
        basedir: '.',
        debug: true,
        entries: ['src/ts/init.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});

gulp.task('jsmin', function () {
    gulp.src(['dist/*.js'])
    .pipe(uglify({
        mangle:{except:['require','exports','module','$']}
    }))
    .pipe(gulp.dest('dist/jsmin'));
});

gulp.task('copy-css', function () {
    gulp.src(paths.css)
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});

gulp.task('copy-html', function () {
    gulp.src(paths.pages)
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});


gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(paths.pages, ['copy-html']);
    gulp.watch(paths.css, ['copy-css']);
    gulp.watch(paths.ts, ['tsc']);
});

gulp.task('default', ['copy-html', 'copy-css', 'tsc', 'watch']);
gulp.task('fuck', ['jsmin']);
