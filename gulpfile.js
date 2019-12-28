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
const del = require('del');
const { argv } = require('yargs');
const chalk = require('chalk');

process.env.NODE_ENV = argv.production ? 'production' : 'development';
log(`Running in ${chalk.bold.green(process.env.NODE_ENV)} mode`);

/**
 * Delete all files in dist
 */
gulp.task('clean', () => {
	log('Cleaning files in dist ' + (new Date()).toString());
	return new Promise(resolve => {
		del.sync('./dist');
		resolve();
	});
});

/**
 * Copy HTML to dist
 */
gulp.task('html', () => {
	log('Copying HTML files ' + (new Date()).toString());

	return gulp.src('src/*.html')
		.pipe(gulp.dest('dist/'));
});

/**
 * Copy assets to dist
 */
gulp.task('assets', () => {
	log('Copying assets files ' + (new Date()).toString());

	return gulp.src([
		'src/assets/**/*.ico',
		'src/assets/**/*.png',
		'src/assets/**/*.jpeg',
		'src/assets/**/*.svg'
	]).pipe(gulp.dest('dist/assets/'));
});

/**
 * Converts all SCSS to CSS
 * Minify the CSS
 * Adds auto-prefix for browser support
 */
gulp.task('sass', () => {
	log('Generating CSS files ' + (new Date()).toString());

	return gulp.src('src/scss/*.scss')
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
 * ES Lint all JavaScripts files
 */
gulp.task('lint', () => {
	log('Linting JS files ' + (new Date()).toString());

	return gulp.src('src/js/*.js')
		.pipe(eslint())
		.pipe(eslint.format());
});

/**
 * Bundle all Javascript to one JS file
 */
gulp.task('scripts', () => {
	return gulp.src('src/js/*.js')
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
	log('Compile JS files ' + (new Date()).toString());

	return gulp.src('src/js/')
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('dist/js'));
});

/**
 * Gulp task to reload browser
 */
gulp.task('reload', (done) => {
	browserSync.reload();
	done();
});



/**
 * Gulp task to watch for file changes
 */
gulp.task('watch', () => {
	browserSync.init({
		server: './dist/',
		port: 8000,
		open: false
	});

	log('Watching js files for modifications');
	gulp.watch('src/js/*.js', gulp.series('lint', 'webpack', 'reload'));

	log('Watching scss files for modifications');
	gulp.watch(['src/scss/**/*.scss'], gulp.series('sass', 'reload'));

	log('Watching html files for modifications');
	gulp.watch('src/*.html', gulp.series('html', 'reload'));

	log('Watching assets for modifications');
	gulp.watch('src/assets/', gulp.series('assets', 'reload'));
});

/**
 * Default gulp task
 */
gulp.task('default', gulp.series(
	'clean', 'html', 'sass', 'assets', 'webpack', 'lint', 'watch'
));
