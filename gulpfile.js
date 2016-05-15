var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var server = require('gulp-server-livereload');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

// gulp.task('sass', function() {
//     return sass('src/sass/main.scss', { sourcemap: true, style: 'compact' })
//         .on('error', sass.logError)
//         .pipe(sourcemaps.init({loadMaps: true}))
//         .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
//         .pipe(rename('app.css'))
//         .pipe(minifycss())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest('dist/css'));
// });

gulp.task('sass', function() {
    return sass('src/sass/main.scss')
        .on('error', sass.logError)
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function() {
    gulp.src([
            'src/js/jquery.js',
            'src/js/component.js'
        ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('images', function(){
    return gulp.src('src/images/**/*.*')
        .pipe(cache(imagemin()))
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
            port: 4000,
            defaultFile: 'index.html'
        }));
});

gulp.task('default', function() {
    gulp.start('pages', 'js', 'sass', 'images');
    gulp.watch('src/*.html', ['pages']);
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/images/**/*.*', ['images']);
});