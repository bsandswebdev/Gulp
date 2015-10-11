//GULP
var gulp = require('gulp');

//PLUGINS
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

//BROWSER SYNC
gulp.task('browser-sync', function() {
    browserSync.init(['css/theme.css', 'index.html'], {      			// Files to inject
        /*server: {
            baseDir: "./"
        }*/
        proxy: "localhost:8888"
    });
});

//SAAS + SOURCEMAPS + AUTOPREFIXER + MINIFY CSS
var input = './scss/theme.scss'; //var input = './scss/**/*.scss';  	        //Option to input all .scss files instead of import theme.scss
var output = './css';
var sassOptions = {errLogToConsole: true, outputStyle: 'expanded'};
var autoPrefixerOptions = {browsers: ['last 2 versions'], cascade: true}

gulp.task('sass', function () {
  return gulp
    .src(input)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))				//Sass options      
    .pipe(sourcemaps.write())							//Sourcemaps							    
    .pipe(autoprefixer(autoPrefixerOptions))					//Autoprefixer			   
    .pipe(gulp.dest(output))							//Output theme.css
    .pipe(minifyCss())								//Minify CSS 										
    .pipe(rename('theme.min.css'))						//Rename to .min file						
    .pipe(gulp.dest('css'));							//Output minified CSS file
});

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

//Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('images/original', ['images']);
    gulp.watch('scss/*', ['sass']);
    gulp.watch('css/theme.css.map', ['sass']);
});

// Default Task
gulp.task('default', ['browser-sync', 'sass', 'watch' ]);
