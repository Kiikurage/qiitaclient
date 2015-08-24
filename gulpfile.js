'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');
var vulcanize = require('gulp-vulcanize');
var modRewrite = require('connect-modrewrite');

/**
 * build sass file.
 * @TODO minify
 */
gulp.task('build::sass', function() {
	return gulp.src('./src/elements/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(rename(function(path) {
			path.extname = '.css';
		}))
		.pipe(gulp.dest('./src/elements/'));
});

/**
 * watch sass files, and when changed, build it.
 */
gulp.task('watch::sass', ['build::sass'], function() {
	return gulp.watch('./src/elements/**/*.scss', ['build::sass', 'vulcanize']);
});

/**
 * build js
 * @TODO uglifyJS
 * @ref https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md
 */
gulp.task('build::js', function() {
	return gulp.src('./src/util/main.js')
		.pipe(plumber())
		.pipe(browserify({
			debug: true
		}))
		.pipe(rename(function(path) {
			path.dirnaem = '';
			path.basename = 'script';
			path.extname = '.js';
		}))
		.pipe(gulp.dest('./build/'));
});

/**
 * copy static library files.
 */
gulp.task('build::static', function() {
	return gulp.src([
			'./bower_components/sw-toolbox/sw-toolbox.js',
			'./node_modules/webcomponents.js/webcomponents.min.js',
			'./src/page/sw.js',
			'./src/manifest.json'
		])
		.pipe(gulp.dest('./build/'))
});

/**
 * watch js files, and when changed, compile it.
 */
gulp.task('watch::js', ['build::js'], function() {
	return gulp.watch([
		'./src/**/*.js',
		'./src/elements/**/*.js'
	], ['build::js']);
});

/**
 * watch html files, and when changed, build it.
 */
gulp.task('watch::html', function() {
	return gulp.watch([
		'./src/page/index.html',
		'./src/elements/**/*.html'
	], ['vulcanize']);
});

gulp.task('vulcanize', function() {
	return gulp.src('./src/page/index.html')
		.pipe(vulcanize({
			abspath: './src',
			inlineScripts: false,
			inlineCss: true,
		}))
		.pipe(rename(function(path) {
			path.dirname = './';
			path.basename = 'index';
			path.extname = '.html';
		}))
		.pipe(gulp.dest('./build/'))
});

/**
 * run http server for debug only.
 */
gulp.task('server', ['build::static', 'watch::sass', 'watch::js', 'watch::html'], function() {
	connect.server({
		root: './build',
		livereload: false,
		middleware: function(connect, opt) {
			return [
				modRewrite(['^/[^\.]*$ / [L]'])
			];
		},
		port: 9000
	});
});

gulp.task('default', function() {
	gulp.start('server');
});
