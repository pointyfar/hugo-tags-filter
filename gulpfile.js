var fs          = require('fs');
var gulp        = require('gulp');
var browserify  = require('browserify');
var babelify    = require('babelify');
var buffer      = require('vinyl-buffer');
var source      = require('vinyl-source-stream');
var rename      = require('gulp-rename');
var uglify      = require('gulp-uglify');
var del         = require("del");

gulp.task('js:build', function () {
  var pj = JSON.parse(fs.readFileSync('./package.json'));
  CLEAN( './dist' );
  return browserify({entries: './src/hugotagsfilter.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source(`hugotagsfilter-${pj.version}.js`))
        .pipe(gulp.dest('./dist'))
        .pipe(buffer())
        .pipe(uglify({output:{comments:'some'}}))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('./dist'));
        ;
});

function CLEAN (target) {
  return del.sync(target);
}