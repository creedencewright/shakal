var gulp      = require('gulp');
var reload    = require('gulp-livereload');
var less      = require('gulp-less');
var minifycss = require('gulp-minify-css');
var plumber   = require('gulp-plumber');
var prefix    = require('gulp-autoprefixer');
var getTime = require('../get-time')

var chalk = require('chalk');
var path  = require('path');

module.exports = function(project) {
    var files = [];

    console.log(chalk.cyan('Stylesheets'));

    project.stylePath.forEach(function(file) {
        file = path.normalize(project.path + file);
        files.push(file);
        console.log(file + '\n');
    });

    gulp.task(project.name + "_less", function() {
        console.log('[' + chalk.grey(getTime()) + ']' + ' Running ' +
        chalk.cyan(project.name + "_style"));

        var bundle = gulp.src(files, {base: project.path})

            //Error handling
            .pipe(plumber(function(error) {
                //dialog.warn(error.message);
                console.log('['+chalk.grey(getTime())+'] ' + chalk.bgRed.white(error.message));
                this.emit('end');
            }))

            .pipe(less());

        if (project.styleAutoprefixer) {
            bundle.pipe(prefix(project.styleAutoprefixer))
        }

        bundle.pipe(minifycss())
            .pipe(gulp.dest(project.path))
            .on('end', function() {
                console.log('['+chalk.grey(getTime())+'] '+chalk.cyan(project.name + "_less") + ' is finished');
            })
            .pipe(reload());
    });
};
