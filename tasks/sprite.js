var gulp        = require('gulp');
var imagemin    = require('gulp-imagemin');
var pngquant    = require('imagemin-pngquant');
var path        = require('path');
var spritesmith = require('gulp.spritesmith');
var chalk       = require('chalk');
var getTime     = require('../get-time');

module.exports = function(project) {
    console.log(chalk.cyan('Sprite'));
    console.log('Looking for images in ' + chalk.green(project.spriteSourcePath) + '...\n');

    gulp.task(project.name + '_sprite', function() {
        var startTime = Date.now();
        console.log('[' + chalk.grey(getTime()) + '] ' + 'Starting \'' + chalk.cyan(project.name + "_sprite") + '\'...');

        var spriteData = gulp.src([path.normalize(project.path + project.spriteSourcePath + '*.png'), path.normalize(project.path + project.spriteSourcePath + '*.jpg')])
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.less',
                cssFormat: 'less',
                algorithm: 'binary-tree',
                padding: 2
            }));

        spriteData.img
            .pipe(pngquant({quality: '65-80', speed: 4})())
            .pipe(gulp.dest(path.normalize(project.path + project.spritePath)));

        spriteData.css
            .pipe(gulp.dest(project.path + project.spriteCssPath))
            .on('end', function() {
                var timePassed = Date.now() - startTime;
                timePassed = timePassed >= 100 ? (timePassed/1000).toFixed(2) + 's' : timePassed + 'ms'

                console.log('[' + chalk.grey(getTime()) + '] Finished \'' + chalk.cyan(project.name + "_sprite") + '\' after ' + chalk.magenta(timePassed));
            });
    });
}
