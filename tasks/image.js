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
        folder = path.normalize(project.path + folder + '**/*.png');
        folders.push(folder);
        console.log(folder + '\n');
    });

    gulp.task(project.name + "_image", function() {
        console.log('['+chalk.grey(getTime())+'] '+'Running ' + chalk.cyan(project.name + "_image"));

        gulp.src(folders, {base: project.path})
            .pipe(cache('min'))
            .pipe(imagemin({use: [pngquant()]}))
            .on('end', function() {
                console.log('[' + chalk.grey(getTime()) + '] ' + chalk.cyan(project.name + "_image") + ' is finished');
            })
            .pipe(gulp.dest(project.path));
    });
}
