//Include gulp, and launch the task loader
var gulp = require('gulp');
var fs = require('fs-extra');

//Manage CLI flags
var args = require('yargs').argv;

//Get all the other modules necessary to build this out
var bump = require('gulp-bump');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var check = require('gulp-if');
var coveralls = require('gulp-coveralls');
var doc = require('gulp-jsdoc-to-markdown');
var forEach = require('gulp-foreach');
var karma = require('karma').server;
var open = require('gulp-open');
var regrep = require('gulp-regex-replace');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var util = require('gulp-util');



//Rename result folders
var splitPath = function(path){
	var output = {};

	//Get path segments
	output.path = path.split('\\');
	output.dir = output.path[output.path.length - 2];
	output.fileName = output.path[output.path.length - 1];
	output.fileType = output.fileName.lastIndexOf('.') > -1 ? output.fileName.substring(output.fileName.lastIndexOf('.')) : '';
	output.path.pop();

	return output;
};



//Generic unit testing options
var unitOpts = {
	configFile: __dirname+'/test/config/karma.conf.js',
	reporters: ['mocha', 'html']
};



//Jasmine tests, for simple in browser verification
gulp.task('jasmine', function() {
	gulp.src(['./test/jasmine.html'])
		.pipe(open('<%file.path%>'));
});

//Basic unit testing
gulp.task('unit-chrome', function(done) {
	unitOpts.browsers = ['Chrome'];
	unitOpts.htmlReporter = {
		outputFile: 'test/results/spec/chrome.html'
	};

	return karma.start(unitOpts, done);
});

//Unit for browser compatibility
gulp.task('unit-browsers', function(done) {
	unitOpts.browsers = ['Chrome', 'ChromeCanary', 'Firefox', 'FirefoxDeveloper', 'IE11', 'IE10', 'IE9'];
	unitOpts.htmlReporter = {
		outputFile: 'test/results/spec/compatibility.html'
	};

	return karma.start(unitOpts, done);
});

//Full Karma run-through for coverage
gulp.task('karma-coverage', function(done) {
	var opts = {
		configFile: __dirname+'/test/config/karma.coverage.js',
		browsers: args.browsers ? [args.browsers] : ['Chrome'],
	};

	return karma.start(opts, done);
});

//Test for basic completeness and coverage
gulp.task('coverage', ['karma-coverage'], function() {
	return gulp.src(['./test/results/coverage/Chrome*']) //'+ args.browser ? args.browser : 'Chrome' +'
		.pipe(forEach(function(stream, file){
			fs.copySync(file.path, splitPath(file.path).path.join('\\'));
			fs.removeSync(file.path);
		}))
});





//Make the markdown version of the API
gulp.task('api', function() {
	gulp.src(['./src/**/*.js'])
		.pipe(doc())
		.pipe(rename(function(path){
			path.basename = "API";
			path.extname = ".md";
		}))
		.pipe(replace('##', '\n* * *\n###'))
		.pipe(replace(/\#Backbone/, '## API'))
		.pipe(gulp.dest('./docs'))
});

//Make the readme file
gulp.task('docs', ['api'], function() {
	gulp.src(['./docs/INTRO.md', './docs/EXAMPLES.md', './docs/API.md', './docs/ENDNOTES.md', 'LICENSE.md'])
		.pipe(concat('README.md'))
		.pipe(gulp.dest('./'))
});

//Bump the version
gulp.task('bump', ['docs'], function() {
	gulp.src(['./package.json', './bower.json'])
		.pipe(bump({type: args.vers || 'patch'}))
		.pipe(gulp.dest('./'));
});

//Copy the original file to the dist folder
gulp.task('copy', ['bump'], function() {
	gulp.src(['./src/textStack.js'])
		.pipe(gulp.dest('./dist'))
});

//Build this sucker!
gulp.task('build', ['copy'], function() {
	gulp.src(['./src/**/*.js'])
		.pipe(uglify())
		.pipe(rename(function(path){
			path.basename += '.min';
		}))
		.pipe(gulp.dest('./dist'))
});



//Submit to coveralls
gulp.task('coveralls', function() {
	gulp.src('./test/**/lcov.info')
		.pipe(coveralls());
});