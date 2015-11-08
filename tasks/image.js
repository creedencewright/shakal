var gulp     = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache    = require('gulp-cached');
var path     = require('path');
var chalk    = require('chalk');
var getTime  = require('../get-time');

module.exports = function(project) {
    var folders = [];

    console.log(chalk.cyan('Images'));

    project.imagesPath.forEach(function(folder) {
        folder = path.normalize(project.path + folder + '**/*.+(jpg|png)');
        folders.push(folder);
        console.log(folder + '\n');
    });

    gulp.task(project.name + "_image", function() {
        var startTime = Date.now();
        console.log('[' + chalk.grey(getTime()) + '] ' + 'Starting \'' + chalk.cyan(project.name + "_image") + '\'...');

        gulp.src(folders, {base: project.path})
            .pipe(cache('min'))
            .pipe(imagemin({
                progressive: true,
                use: [pngquant()]
            }))
            .on('end', function() {
                var timePassed = Date.now() - startTime;
                timePassed = timePassed >= 100 ? (timePassed/1000).toFixed(2) + 's' : timePassed + 'ms'

                console.log('[' + chalk.grey(getTime()) + '] Finished \'' + chalk.cyan(project.name + "_image") + '\' after ' + chalk.magenta(timePassed));
            })
            .pipe(gulp.dest(project.path));
    });
}
