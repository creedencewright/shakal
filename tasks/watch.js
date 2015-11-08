var gulp    = require('gulp');
var path    = require('path');
var reload  = require('gulp-livereload');
var gaze    = require('gaze');
var chalk   = require('chalk');
var getTime = require('../get-time');

module.exports = function(project) {
    var gazeParams = {cwd: project.path};

    //var start is for tasks that '-watch' will start
    var start = [];
    if (project.imagesPath) { start.push(project.name + "_image"); }
    if (project.styleProcessor) { start.push(project.name + "_less"); }
    if (project.spriteSourcePath) { start.push(project.name + "_sprite"); }

    gulp.task(project.name + "_watch", start, function() {
        if (project.styleProcessor) {
            var lessFolders = [];

            project.stylePath.forEach(function(file) {
                lessFolders.push(path.dirname(file) + '/**/*.less');
            });

            // LESS Watcher
            gaze(lessFolders, gazeParams, function() {
                this.on('changed', function() {
                    gulp.start(project.name + "_less");
                });
                this.on('added', function(filepath) {
                    console.log('[' + chalk.grey(getTime()) + '] ' +
                    chalk.green(path.basename(filepath) + " was added"));
                    gulp.start(project.name + "_less");
                });
            });
        }

        if (project.imagesPath) {
            gaze(project.imagesPath + "**/*.+(jpg|png)", gazeParams, function(error) {
                this.on('added', function(filepath) {
                    console.log('[' + chalk.grey(getTime()) + '] ' +
                    chalk.green(path.basename(filepath) + " was added"));
                    gulp.start(project.name + "_image");
                });
            });
        }

        if (project.spriteSourcePath) {
            gaze(project.spriteSourcePath + "*.*", gazeParams, function(error) {
                this.on('added', function(filepath) {
                    console.log('[' + chalk.grey(getTime()) + '] ' +
                    chalk.green(path.basename(filepath) + " was added"));
                    gulp.start(project.name + "_sprite");
                });
                this.on('deleted', function(filepath) {
                    console.log('[' + chalk.grey(getTime()) + '] ' +
                    chalk.red(path.basename(filepath) + " was removed"));
                    gulp.start(project.name + "_sprite");
                });
            });
        }

        reload.listen();
    });
};

