var gulp        = require('gulp');
var pngquant    = require('imagemin-pngquant');
var path        = require('path');
var spritesmith = require('gulp.spritesmith');
var mkdirp      = require('mkdirp');
var url2        = require('url2');
var chalk       = require('chalk');
var fs          = require('fs');
var File        = require('vinyl');
var handlebars  = require('handlebars');
var getTime     = require('../get-time');
var SVGSpriter  = require('svg-sprite');
var glob        = require('glob');
var notify      = require('../utils/notifier');

var FILE_NAME = 'sprite';

var templateSource = fs.readFileSync(__dirname + '/style-template.handlebars', 'utf8');

module.exports = function(project, config, params) {
    console.log(chalk.cyan('Sprite'));
    console.log('Looking for images in ' + chalk.green(path.normalize(project.path + project.spriteSourcePath)) +
        '...\n');

    gulp.task(project.name + '_sprite', function() {
        var startTime      = Date.now();
        var srcPath        = path.normalize(project.path + project.spriteSourcePath);
        var distSpritePath = path.normalize(project.path + project.spritePath);
        var distCssPath    = project.spriteCssPath ? path.normalize(project.path +
            project.spriteCssPath) : path.normalize(project.path + project.spritePath);
        var relativePath   = project.spriteCssPath ? url2.relative(distCssPath, distSpritePath) : '';

        console.log('[' + chalk.grey(getTime()) + '] ' + 'Starting \'' + chalk.cyan(project.name + "_sprite") +
            '\'...');

        var mixinName     = 'icon';
        var styleFilename = 'icons';

        var p1 = new Promise(function(resolve) {
            var spriter = new SVGSpriter({
                dest: '.',
                mode: {
                    css: {
                        dest: './',
                        prefix: '',
                        sprite: relativePath + '/' + FILE_NAME + '.svg',
                        bust: false,
                        render: true
                    }
                }
            });

            glob.glob(srcPath + '/**/*.svg', function(err, files) {
                if (!files.length) {
                    resolve([]);
                    return;
                }

                files.forEach(function(file) {
                    var filepath = path.resolve(file);

                    spriter.add(new File({
                        path: filepath, // Absolute path to the SVG file
                        base: path.dirname(filepath), // Base path (see `name` argument)
                        contents: fs.readFileSync(filepath) // SVG file contents
                    }));
                });

                spriter.compile(function(error, result, data) {
                    var sprite = result.css.sprite.contents;

                    mkdirp.sync(distSpritePath);
                    fs.writeFileSync(distSpritePath + FILE_NAME + '.svg', sprite);

                    var setShapeData = function(shape) {
                        return {
                            image: data.css.sprite,
                            svg: true,
                            name: shape.name,
                            pos: shape.position.relative.xy,
                            w: shape.width.outer + 'px',
                            h: shape.height.outer + 'px'
                        };
                    };

                    resolve(data.css.shapes.map(setShapeData));
                });
            });
        });

        var p2 = new Promise(function(resolve) {
            var spriteData = gulp.src(path.normalize(srcPath + '/**/*.png'))
                .pipe(spritesmith({
                    imgName: FILE_NAME + '.png',
                    cssName: 'style.css',
                    algorithm: 'binary-tree',
                    padding: 2,
                    cssTemplate: function(data) {
                        var setImageData = function(image) {
                            return {
                                svg: false,
                                image: relativePath + image.escaped_image,
                                name: image.name,
                                pos: image.px.offset_x + ' ' + image.px.offset_y,
                                w: image.px.width,
                                h: image.px.height
                            };
                        };

                        resolve(data.sprites.map(setImageData));

                        return ''; // prevents css file rendering
                    }
                }));

            spriteData.img
                .pipe(gulp.dest(distSpritePath));
        });

        var compile = function(values) {
            var template = handlebars.compile(templateSource);

            var templateData = {
                svgs: values[0],
                pngs: values[1],
                mixinName: mixinName
            };

            var cssStr = template(templateData);

            mkdirp.sync(distCssPath);
            fs.writeFileSync(distCssPath + styleFilename + '.less', cssStr);

            var timePassed = Date.now() - startTime;
            timePassed     = timePassed >= 100 ? (timePassed / 1000).toFixed(2) + 's' : timePassed + 'ms'

            console.log('[' + chalk.grey(getTime()) + '] Finished \'' + chalk.cyan(project.name + "_sprite") +
                '\' after ' + chalk.magenta(timePassed));
        };

        Promise.all([p1, p2]).then(compile).catch(function(err) {
            console.log(err);
        });
    });
}
