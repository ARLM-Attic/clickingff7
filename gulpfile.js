var gulp = require('gulp');
var gulpSequence = require('gulp-sequence').use(gulp);
var traceur = require('gulp-traceur');
var browserSync = require('browser-sync').create();
var _if = require('gulp-if');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var del = require('del');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var Server = require('karma').Server;


var sourceFolder = './app';
var destFolder = 'dist';
var depFolder = './jspm_packages';
var needBrowserSync = false;

gulp.task('test', function (done) {
    return new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function() {
        done();
    }).start();
});

gulp.task('browserSync', function () {
    needBrowserSync = true;
    browserSync.init({
        server: {
            baseDir: destFolder,
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        }
    });
});

gulp.task('scripts', function () {
    gulp.src(sourceFolder + '/**/*.js')
        .pipe(traceur({modules: 'instantiate'}))
        .pipe(gulp.dest(destFolder))
        .pipe(_if(needBrowserSync, browserSync.stream()));
});

gulp.task('styles', function () {
    return gulp.src(sourceFolder + '/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less()
            .on('error', function (err) {
                console.log(err);
                this.emit('end');
            }))
        .pipe(cleanCSS())
        .pipe(rename('app.css'))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(destFolder + '/css'))
        .pipe(_if(needBrowserSync, browserSync.stream()));
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
    return gulp.src(sourceFolder + '/resources/images/**/*')
        .pipe(imagemin({
            'optimizationLevel': 3,
            'progressive': true,
            'interlaced': true
        }))
        .pipe(gulp.dest(destFolder + '/resources/images'))
        .pipe(_if(needBrowserSync, browserSync.stream()));
});

gulp.task('watch-dev', function () {

    // Watch i18n/*.json files
    gulp.watch(sourceFolder + '/i18n/*.json', ['json'])
        .on('change', browserSync.reload);

    // Watch *.js files
    gulp.watch(sourceFolder + '/**/*.js', ['scripts']);

    // Watch *.less files
    gulp.watch(sourceFolder + '/**/*.less', ['styles']);

    // Watch image files
    gulp.watch(sourceFolder + '/resources/images/*', ['images'])
        .on('change', browserSync.reload);

    // Watch html files
    gulp.watch(sourceFolder + '/**/*.html', ['html']);
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

gulp.task('vendorStyles', function () {
    return gulp.src([
            depFolder + '/github/uikit/uikit@2.22.0/css/uikit.min.css',
            depFolder + '/github/uikit/uikit@2.22.0/css/components/progress.min.css',
            depFolder + '/github/uikit/uikit@2.22.0/css/components/tooltip.min.css'
        ])
        .pipe(concat('libraries.css'))
        .pipe(gulp.dest(destFolder + '/css'))
        .pipe(_if(needBrowserSync, browserSync.stream()));
});

gulp.task('vendorFonts', function () {
    return gulp.src(depFolder + '/github/uikit/uikit@2.22.0/fonts/*')
        .pipe(gulp.dest(destFolder + '/fonts'));
});

gulp.task('default',
    gulpSequence(
        'clean',
        ['jspm', 'jspm-config', 'vendorStyles', 'vendorFonts'],
        ['scripts', 'styles', 'html', 'json', 'images']
    )
);

gulp.task('build', ['default']);
gulp.task('watch', ['watch-dev']);

gulp.task('dev',
    gulpSequence(
        'browserSync',
        'build',
        'watch'
    )
);