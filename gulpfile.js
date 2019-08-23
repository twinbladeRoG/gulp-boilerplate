const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean-css');
const terser = require('gulp-terser');
const log = require('fancy-log');

// Lint Task
gulp.task('lint', () => {
	log('Linting JS files ' + (new Date()).toString());

	return gulp.src('js/*.js')
		.pipe(eslint())
		.pipe(eslint.format());
});

// Compiling SCSS to CSS
gulp.task('sass', () => {
	log('Generating CSS files ' + (new Date()).toString());

	return gulp.src('scss/*.scss')
		.pipe(plumber({
			errorHandler: function (err) {
				notify.onError({
					title: 'Gulp error in ' + err.plugin,
					message: err.toString()
				})(err);
			}
		}))
		.pipe(sass({
			errLogToConsole: false
		}))
		.pipe(autoprefixer('last 3 version', 'safari 5', 'ie 8', 'ie 9'))
		.pipe(gulp.dest('dist/css'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(clean({
			compatibility: 'ie8'
		}))
		.pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', () => {
	return gulp.src('js/*.js')
		.pipe(plumber({
			errorHandler: function (err) {
				notify.onError({
					title: 'Gulp error in ' + err.plugin,
					message: err.toString()
				})(err);
			}
		}))
		.pipe(concat('bundle.js'))
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(gulp.dest('dist/js'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(terser())
		.pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', () => {
	log('Watching js files for modifications');
	gulp.watch('js/*.js', gulp.series('lint', 'scripts')).on('change', browserSync.reload);
	log('Watching scss files for modifications');
	gulp.watch(['scss/**/*.scss'], gulp.series('sass')).on('change', browserSync.reload);
	log('Watching html files for modifications');
	gulp.watch('*.html').on('change', browserSync.reload);

	browserSync.init({
		server: './',
		open: false
	});
});

// Default Gulp task
gulp.task('default', gulp.series('watch'));