//GULP
var gulp = require('gulp');

//PLUGINS
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var path = require('path');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');

//VARIABLES
//var input = './scss/**/*.scss';  /*inputs all .scss files*/
var input = './scss/theme.scss';
var output = './css';
var sassOptions = {
	errLogToConsole: true,
  	outputStyle: 'expanded'
};
var autoPrefixerOptions = {
	browsers: ['last 2 versions'],
    cascade: true
}

//IMAGEMIN
gulp.task('images', function () {
    return gulp.src('images/original/*')
        .pipe(imagemin({
        	optimizationLevel: 3,
        	interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('images/optimized'));
});

//SAAS + SOURCEMAPS + AUTOPREFIXER
gulp.task('sass', function () {
  return gulp
    .src(input)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(autoPrefixerOptions))
    .pipe(gulp.dest(output));
});

//BROWSER SYNC
gulp.task('browser-sync', function() {
    browserSync.init(['css/theme.css', 'index.html'], {        // files to inject
        /*server: {
            baseDir: "./"
        }*/
        proxy: "localhost:8888"
    });
});

//MINIFY-CSS 
gulp.task('minify-css', function() {
  return gulp.src('css/theme.css')
    .pipe(minifyCss())
    .pipe(rename('theme.min.css'))
    .pipe(gulp.dest('css'));
});

//Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('images/original', ['images']);
    gulp.watch('scss/*', ['sass']);
    gulp.watch('css/theme.css.map', ['sass']);
    gulp.watch('css/theme.css', ['minify-css']);
});

// Default Task
gulp.task('default', ['browser-sync', 'sass', 'watch' ]);

