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
const webpack = require('webpack-stream');

/**
 * ES Lint all JavaScripts files
 */
gulp.task('lint', () => {
	log('Linting JS files ' + (new Date()).toString());

	return gulp.src('js/*.js')
		.pipe(eslint())
		.pipe(eslint.format());
});


/**
 * Converts all SCSS to CSS
 * Minify the CSS
 * Adds auto-prefix for browser support
 */
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


/**
 * Bundle all Javascript to one JS file
 */
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

/**
 * Coverts all ES6 syntax to browser compatible using Webpack
 */
gulp.task('webpack', () => {
	return gulp.src('js/')
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('dist/js'));
});

/**
 * Gulp task to watch for file changes
 */
gulp.task('watch', () => {
	log('Watching js files for modifications');
	gulp.watch('js/*.js', gulp.series('lint', 'webpack')).on('change', browserSync.reload);
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