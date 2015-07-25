'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');

var Config = {
	debug: true,
	sass: {
		watchPath: [
			'./src/style/main.scss',
			'./src/style/**/*.scss'
		],
		rootPath: './src/style/main.scss',
		dest: {
			dirname: './build',
			basename: 'style',
			extname: '.css'
		}
	},
	js: {
		watchPath: './src/js/**/*.js',
		rootPath: './src/js/util/main.js',
		dest: {
			dirname: './build',
			basename: 'script',
			extname: '.js'
		}
	},
	html: {
		watchPath: './src/html/*.*',
		rootPath: './src/html/*.*',
		dest: {
			dirname: './build'
		}
	},
	server: {
		rootPath: ['./build', './']
	}
};

/**
 * Create gulp-rename function object with specified config object.
 * @param {Object} config configuration object of gulp-rename.
 */
function renamer(config) {
	return rename(function(path) {
		path.basename = config.basename;
		path.extname = config.extname;
	});
}

/**
 * build sass file.
 * @TODO minify
 */
gulp.task('build::sass', function() {
	return gulp.src(Config.sass.rootPath)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(renamer(Config.sass.dest))
		.pipe(gulp.dest(Config.sass.dest.dirname));
});

/**
 * watch sass files, and when changed, build it.
 */
gulp.task('watch::sass', ['build::sass'], function() {
	return gulp.watch(Config.sass.watchPath, ['build::sass']);
});

/**
 * build js
 * @TODO uglifyJS
 * @ref https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md
 */
gulp.task('build::js1', function() {
	return gulp.src(Config.js.rootPath, {
			read: false
		})
		.pipe(plumber())
		.pipe(browserify({
			debug: Config.debug
		}))
		.pipe(renamer(Config.js.dest))
		.pipe(gulp.dest(Config.js.dest.dirname));
});

/**
 * copy static library files.
 * @TODO it's very dirty hack!!!!!!!!!!!!!!
 */
gulp.task('build::js2', function() {
	return gulp.src('./bower_components/sw-toolbox/sw-toolbox.js')
		.pipe(rename(function(path){
			path.basename = 'sw-toolbox'
		}))
		.pipe(gulp.dest('./build/'))
});

/**
 * watch js files, and when changed, compile it.
 */
gulp.task('watch::js', ['build::js1', 'build::js2'], function() {
	return gulp.watch(Config.js.watchPath, ['build::js1']);
});

/**
 * build html
 * @TODO minify
 */
gulp.task('build::html', function() {
	gulp.src(Config.html.rootPath)
		.pipe(gulp.dest(Config.html.dest.dirname));
});

/**
 * watch html files, and when changed, build it.
 */
gulp.task('watch::html', ['build::html'], function() {
	return gulp.watch(Config.html.watchPath, ['build::html']);
});

/**
 * run http server for debug only.
 */
gulp.task('server', ['watch::sass', 'watch::js', 'watch::html'], function() {
	connect.server({
		root: Config.server.rootPath,
		livereload: false,
		port: 9000
	});
});

gulp.task('default', function() {
	gulp.start('server');
});
