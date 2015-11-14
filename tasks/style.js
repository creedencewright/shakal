var gulp      = require('gulp');
var reload    = require('gulp-livereload');
var less      = require('gulp-less');
var minifycss = require('gulp-minify-css');
var plumber   = require('gulp-plumber');
var getTime   = require('../get-time')
var chalk     = require('chalk');
var path      = require('path');
var notify = require('../utils/notifier');

module.exports = function(project, config, params) {
    if (project.styleAutoprefixer) {
        var prefix = require('gulp-autoprefixer');
    }

    var files = [];

    console.log(chalk.cyan('Stylesheets'));

    project.stylePath.forEach(function(file) {
        file = path.normalize(project.path + file);
        files.push(file);
        console.log(file + '\n');
    });

    gulp.task(project.name + "_less", function() {
        var startTime = Date.now();
        console.log('[' + chalk.grey(getTime()) + '] ' + 'Starting \'' + chalk.cyan(project.name + "_less") + '\'...');

        var bundle = gulp.src(files, {base: project.path})

            //Error handling
            .pipe(plumber(function(error) {
                console.log('[' + chalk.grey(getTime()) + '] ' + chalk.bgRed.white(error.message));
                if (params.notify) notify('Damn, ' + config.getName()+'!', error.message);
                this.emit('end');
            }))

            .pipe(less());

        if (project.styleAutoprefixer) {
            bundle.pipe(prefix(project.styleAutoprefixer))
        }

        bundle
            .pipe(minifycss())
            .pipe(gulp.dest(project.path))
            .on('end', function() {
                var timePassed = Date.now() - startTime;
                timePassed     = timePassed >= 100 ? (timePassed / 1000).toFixed(2) + 's' : timePassed + 'ms'

                console.log('[' + chalk.grey(getTime()) + '] Finished \'' + chalk.cyan(project.name + "_less") +
                '\' after ' + chalk.magenta(timePassed));
            })
            .pipe(reload());
    });
};
