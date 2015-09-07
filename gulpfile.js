//Gulp
var gulp = require('gulp');

//Plugins
var less = require('gulp-less-sourcemap'); //npm install gulp-less gulp-sourcemaps must also be installed
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var path = require('path');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');

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

//LESS + SOURCEMAPS
gulp.task('less', function () {
  gulp.src('less/theme.less')
    .pipe(less({
        sourceMap: {
            sourceMapRootpath: 'less' // Optional absolute or relative path to your LESS files 
        }
    }))
    .pipe(gulp.dest('css'));
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

//AUTOPREFIXER
gulp.task('autoprefixer', function () {
    return gulp.src('css/theme.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
        .pipe(gulp.dest('css'));
});

//Watch Files For Changes
gulp.task('watch', function() {
    //gulp.watch('images/original', ['images']);
    gulp.watch('less/*', ['less']);
    gulp.watch('css/theme.css.map', ['less']);
    gulp.watch('css/theme.css', ['autoprefixer']);
    gulp.watch('css/theme.css', ['minify-css']);
});

// Default Task
gulp.task('default', ['browser-sync', 'watch' ]);

