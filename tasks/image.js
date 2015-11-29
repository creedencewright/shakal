var gulp     = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache    = require('gulp-cached');
var path     = require('path');
var chalk    = require('chalk');
var getTime  = require('../get-time');
var plumber  = require('gulp-plumber');

module.exports = function(project, config, params) {
    var folders = [];

    console.log(chalk.cyan('Images'));

    project.imagesPath.forEach(function(folder) {
        folder = path.normalize(project.path + folder + '**/*.+(jpg|png)');
        folders.push(folder);
        console.log(folder + '\n');
    });

    gulp.task(project.name + "_image", function() {
        setTimeout(function() {
            var startTime = Date.now();

            console.log('[' + chalk.grey(getTime()) + '] ' + 'Starting \'' + chalk.cyan(project.name + "_image") +
            '\'...');

            gulp.src(folders, {base: project.path})

                //Error handling
                .pipe(plumber(function(error) {
                    console.log('[' + chalk.grey(getTime()) + '] ' + chalk.bgRed.white(error.message));
                    if (params.notify) notify('Damn, ' + config.getName() + '!', error.message);
                    this.emit('end');
                }))

                .pipe(cache('min'))
                .pipe(imagemin({
                    progressive: true,
                    use: [pngquant()]
                }))
                .on('end', function() {
                    var timePassed = Date.now() - startTime;
                    timePassed     = timePassed >= 100 ? (timePassed / 1000).toFixed(2) + 's' : timePassed + 'ms'

                    console.log('[' + chalk.grey(getTime()) + '] Finished \'' + chalk.cyan(project.name + "_image") +
                    '\' after ' + chalk.magenta(timePassed));
                })
                .pipe(gulp.dest(project.path));
        }, 2000);
    });
}
