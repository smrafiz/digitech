// Requiring Gulp
var gulp = require('gulp');

// Requiring the gulp-sass plugin
var sass = require('gulp-sass');

// Requiring the gulp-useref plugin
var useref = require('gulp-useref');

// Requiring the gulp-imagemin plugin
var imagemin = require('gulp-imagemin');

// Requiring the gulp-autoprefixer plugin
var autoprefixer = require('gulp-autoprefixer');

// Requiring the gulp-sourcemaps plugin
var sourcemaps = require('gulp-sourcemaps');

// Requiring the cache plugin
var cache = require('gulp-cache');

// Requiring the browser-sync
var browserSync = require('browser-sync').create();

// Requiring the gulp-cssbeautify plugin
var cssbeautify = require('gulp-cssbeautify');

// Requiring the gulp-group-css-media-queries plugin
var gcmq = require('gulp-group-css-media-queries');

// Requiring the del plugin
var del = require('del');

// Requiring the run-sequence plugin
var runSequence = require('run-sequence');

// Gulp sass function
gulp.task('sass', function() {
    return gulp.src('dev/assets/scss/**/*.scss') // Gets all files ending with .scss in dev/assets/scss
	    .pipe(sourcemaps.init())
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(autoprefixer('last 8 versions')) // Browser Prefix
        .pipe(sourcemaps.write('.')) // Source maps for sass
        // .pipe(gcmq()) // Grouping Media Queries
        .pipe(gulp.dest('dev/assets/css')) // destination
        .pipe(cssbeautify())
        .pipe(gulp.dest('dist/digitech/assets/css')) // final build destination
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Gulp fonts function
gulp.task('fonts', function() {
    return gulp.src('dev/assets/fonts/**/*')
        .pipe(gulp.dest('dist/digitech/assets/fonts'))
})

// Gulp css function
gulp.task('cx-css', function() {
    return gulp.src('dev/assets/css/*.css')
        .pipe(gulp.dest('dist/digitech/assets/css'))
})

// Gulp php function
gulp.task('cx-php', function() {
    return gulp.src('dev/*.php')
        .pipe(gulp.dest('dist/digitech/'))
})

// Gulp js function
gulp.task('cx-js', function() {
    return gulp.src('dev/assets/js/*.js')
        .pipe(gulp.dest('dist/digitech/assets/js'))
})

// Gulp browser sync function
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dev'
        },
    })
})

// Gulp useref function to combine js/css files
gulp.task('useref', function() {
    return gulp.src('dev/*.html')
        .pipe(useref())
        .pipe(gulp.dest('dist/digitech'))
});

// Clearing functions
gulp.task('clean', function() {
    return del.sync('dist/digitech');
})

gulp.task('clean-cache', function(callback) {
    return cache.clearAll(callback)
})

// Gulp useref imagemin to optimize images
gulp.task('images', function() {
    return gulp.src('dev/assets/images/**/*.+(png|jpg|gif|svg|ico)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/digitech/assets/images'))
});

// Gulp watchers
gulp.task('watch', function() {

    // Reloads the browser whenever HTML, SASS or JS files change
    gulp.watch('dev/assets/scss/**/*.scss', ['sass']);
    gulp.watch('dev/*.html', browserSync.reload);
    gulp.watch('dev/assets/js/**/*.js', browserSync.reload);
})

// Gulp default task sequence
gulp.task('build', function(callback) {
    runSequence('clean', ['sass', 'useref', 'images', 'fonts', 'cx-css', 'cx-php', 'cx-js'],
        callback
    )
})

// Gulp task sequence for building
gulp.task('run', function(callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
})