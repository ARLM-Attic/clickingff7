var gulp = require('gulp');
var gulpSequence = require('gulp-sequence').use(gulp);
var traceur = require('gulp-traceur');
var browserSync = require('browser-sync').create();
var _if = require('gulp-if');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var imageop = require('gulp-image-optimization');
var del = require('del');

var sourceFolder = './app';
var destFolder = 'dist';
var depFolder = './jspm_packages';
var needBrowserSync = false;

gulp.task('scripts', function () {
    gulp.src(sourceFolder + '/**/*.js')
        .pipe(traceur({modules: 'instantiate'}))
        .pipe(gulp.dest(destFolder));
});

gulp.task('styles', function () {
    return gulp.src(sourceFolder + '/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less()
            .on('error', function (err) {
                console.log(err);
                this.emit('end');
            }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(destFolder));

});

gulp.task('html', function () {
    return gulp.src(sourceFolder + '/**/*.html')
        .pipe(gulp.dest(destFolder))
        .pipe(_if(needBrowserSync, browserSync.stream()));
});

gulp.task('json', function () {
    return gulp.src(sourceFolder + '/**/*.json')
        .pipe(gulp.dest(destFolder))
        .pipe(_if(needBrowserSync, browserSync.stream()));
});

gulp.task('images', function () {
    return gulp.src(sourceFolder + '/img/**/*')
        .pipe(imageop({
            'optimizationLevel': 3,
            'progressive': true,
            'interlaced': true
        }))
        .pipe(gulp.dest(destFolder + '/img'))
        .pipe(_if(needBrowserSync, browserSync.stream()));
});

gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('clean', function () {
    return del([destFolder, 'dist']);
});

gulp.task('jspm', function () {
    return gulp.src(depFolder + '/**/*')
        .pipe(gulp.dest(destFolder + '/jspm_packages'))
        .pipe(_if(needBrowserSync, browserSync.stream()));
});

gulp.task('jspm-config', function () {
    return gulp.src('config.js')
        .pipe(gulp.dest(destFolder));
});

gulp.task('default',
    gulpSequence(
        'clean',
        ['jspm', 'jspm-config'],
        ['scripts', 'styles', 'html', 'json', 'images']
    )
);

gulp.task('watch', ['watch']);