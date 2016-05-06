var gulp = require("gulp");
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserify = require('browserify')

var sass = require('gulp-sass')
var browserSync = require('browser-sync').create()
var reload = browserSync.reload


gulp.task('proxy', () => {
	browserSync.init({
		proxy : 'localhost:3000',
		port : 8888
	})
})

gulp.task('script', () => {
	return browserify({
			debug : true
		})
		.add("./app/src/main.js")
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(gulp.dest('app/'))
})

gulp.task('babel', () => {
	return gulp.src("app/src/**/*.js")
	    .pipe(sourcemaps.init())
	    .pipe(babel({
	    	presets: ['es2015']
	    }))
	    .pipe(concat("main.js"))
	    .pipe(sourcemaps.write("."))
	    .pipe(gulp.dest("app"))
})

gulp.task('sass', () => {
	return gulp.src("app/src/**/*.scss")
		.pipe(sass())
		.pipe(gulp.dest("app"))
})

gulp.task('watch', () => {
	gulp.watch('app/src/**/*.js', ['script']).on('change', reload)
	gulp.watch('app/**/*.scss', ['sass']).on('change', reload)
	gulp.watch('app/*.html').on('change', reload)
})

gulp.task("default", ['proxy', 'watch', 'script']);