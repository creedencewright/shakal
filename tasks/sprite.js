var gulp        = require('gulp');
var imagemin    = require('gulp-imagemin');
var pngquant    = require('imagemin-pngquant');
var path        = require('path');
var spritesmith = require('gulp.spritesmith');
var chalk       = require('chalk');
var plumber     = require('gulp-plumber');
var getTime     = require('../get-time');
var notify      = require('../utils/notifier');

var FILE_NAME = 'sprite';

module.exports = function(project, config, params) {
    console.log(chalk.cyan('Sprite'));
    console.log('Looking for images in ' + chalk.green(project.spriteSourcePath) + '...\n');

    gulp.task(project.name + '_sprite', function() {
        var startTime      = Date.now();
        var srcPath        = path.normalize(project.path + project.spriteSourcePath);
        var distSpritePath = path.normalize(project.path + project.spritePath);
        var distCssPath    = path.normalize(project.path + project.spriteCssPath);
        var fromCssToImg   = path.normalize(path.relative(distCssPath, distSpritePath) + '/');

        console.log('[' + chalk.grey(getTime()) + '] ' + 'Starting \'' + chalk.cyan(project.name + "_sprite") +
        '\'...');

        var spriteData = gulp.src(srcPath + '*.+(png|jpg)')

            //Error handling
            .pipe(plumber(function(error) {
                console.log('[' + chalk.grey(getTime()) + '] ' + chalk.bgRed.white(error.message));
                if (params.notify) notify('Damn, ' + config.getName() + '!', error.message);
                this.emit('end');
            }))

            .pipe(spritesmith({
                imgName: fromCssToImg + FILE_NAME + '.png',
                cssName: FILE_NAME + '.less',
                cssFormat: 'less',
                algorithm: 'binary-tree',
                padding: 2,
                cssHandlebarsHelpers: {
                    math: function(lvalue, operator, rvalue, options) {
                        lvalue = parseFloat(lvalue);
                        rvalue = parseFloat(rvalue);

                        return {
                            "+": lvalue + rvalue,
                            "-": lvalue - rvalue,
                            "*": lvalue * rvalue,
                            "/": lvalue / rvalue,
                            "%": lvalue % rvalue
                        }[operator];
                    },
                    retinize: function(data, name) {
                        return data.sprites.filter(function(s) {return s.name === name + '@2x';}).length !== 0;
                    }
                },
                cssTemplate: path.normalize(config.getDirectory() + '/tasks/less-sprite-template.handlebars')
            }));

        spriteData.img
            .pipe(pngquant({quality: '65-80', speed: 4})())
            .pipe(gulp.dest(distSpritePath));

        spriteData.css
            .pipe(gulp.dest(distCssPath))
            .on('end', function() {
                var timePassed = Date.now() - startTime;
                timePassed     = timePassed >= 100 ? (timePassed / 1000).toFixed(2) + 's' : timePassed + 'ms'

                console.log('[' + chalk.grey(getTime()) + '] Finished \'' + chalk.cyan(project.name + "_sprite") +
                '\' after ' + chalk.magenta(timePassed));
            });
    });
}
