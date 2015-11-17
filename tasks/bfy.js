var chalk      = require('chalk');
var path       = require('path');
var gulp       = require('gulp');
var babelify   = require('babelify');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var notify     = require('../utils/notifier');
var getTime    = require('../get-time');

module.exports = function(project, config, params) {
    console.log(chalk.cyan('Browserify'));

    var sourceFile = path.normalize(project.path + project.browserifySource);
    var distPath   = path.normalize(project.path + project.browserifyDist);

    console.log(sourceFile);
    console.log(distPath);

    gulp.task(project.name + "_browserify", function() {
        var startTime = Date.now();
        console.log('[' + chalk.grey(getTime()) + '] ' + 'Starting \'' + chalk.cyan(project.name + "_browserify") +
        '\'...');

        var b = browserify(sourceFile).transform(babelify, {presets: ['es2015']});

        if (project.browserifyTransforms !== undefined && project.browserifyTransforms !== false) {
            project.browserifyTransforms.forEach(function(tr) {
                //b.transform(tr);
            });
        }

        b.bundle()
            .on('error', function(error) {
                console.log('[' + chalk.grey(getTime()) + '] ' + chalk.bgRed.white(error.message));
                if (params.notify) notify('Damn, ' + config.getName() + '!', error.message);
                this.emit('end');
            })
            .pipe(source('bundle.js'))
            .on('end', function() {
                var timePassed = Date.now() - startTime;
                timePassed     = timePassed >= 100 ? (timePassed / 1000).toFixed(2) + 's' : timePassed + 'ms'

                console.log('[' + chalk.grey(getTime()) + '] Finished \'' + chalk.cyan(project.name + "_browserify") +
                '\' after ' + chalk.magenta(timePassed));
            })
            .pipe(gulp.dest(distPath));
    });
};
