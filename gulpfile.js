var gulp        = require('gulp');
var browserify  = require('browserify');
var babelify    = require('babelify');
var buffer      = require('vinyl-buffer');
var source      = require('vinyl-source-stream');
var rename      = require('gulp-rename');
var uglify      = require('gulp-uglify');

gulp.task('js:build', function () {
    return browserify({entries: './src/hugotagsfilter.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('hugotagsfilter.dist.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('./dist'));
        ;
});
