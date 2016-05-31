var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-ruby-sass');
var autoPrefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var sourceMaps = require('gulp-sourcemaps');
var server = require('gulp-server-livereload');
var imageMin = require('gulp-imagemin');
var cache = require('gulp-cache');

gulp.task('sass', function() {
    return sass('src/sass/main.scss', { sourcemap: true, style: 'compact' })
        .on('error', sass.logError)
        .pipe(sourceMaps.init({loadMaps: true}))
        .pipe(autoPrefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename('app.css'))
        .pipe(cleanCSS())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('images', function(){
    return gulp.src('src/images/**/*.*')
        .pipe(cache(imageMin()))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('pages', function(){
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
});

gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(server({
            livereload: {
                enable: true,
                filter: function(filePath, cb) {
                    cb( !(/.DS_Store/.test(filePath)) );
                }
            },
            directoryListing: false,
            open: true,
            log: 'info',
            defaultFile: 'index.html'
        }));
});

gulp.task('default', function() {
    gulp.start('pages', 'sass', 'images', 'webserver');
    gulp.watch('src/*.html', ['pages']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/images/**/*.*', ['images']);
});