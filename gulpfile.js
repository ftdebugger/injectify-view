'use strict';

var gulp = require('gulp'),
    KarmaServer = require('karma').Server;

require('./inject');

gulp.task('karma', function (done) {
    var options = {
        configFile: __dirname + '/karma.conf.js',
        autoWatch: true,
        singleRun: false
    };

    new KarmaServer(options, done).start();
});

gulp.task('test', function (done) {
    var options = {
        configFile: __dirname + '/karma.conf.js',
        autoWatch: false,
        singleRun: true
    };

    new KarmaServer(options, done).start();
});

gulp.task('default', ['karma']);
