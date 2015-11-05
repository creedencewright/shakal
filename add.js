var inquirer = require("inquirer");

var message = require('./message');
var config  = require('./config');
var chalk   = require('chalk');
var path    = require('path');

function _isNameOccupied(name) {
    return config.isNameOccupied(name);
}

function setup(projectName, projectPath) {
    var folderName = path.basename(projectPath);
    var settings   = {};

    if (projectName) {
        message('Setting up ' + projectName.toUpperCase() + '...\n', 'green');
    } else {
        message('Woah, I need to know the name of the project here...\n', 'black', 'bgYellow');
    }

    if (projectName) {
        if (_isNameOccupied(projectName)) {
            console.log(chalk.bgYellow.black('Oops :( \n') + 'Looks like you already have a project with a name <' +
            chalk.bgRed.white(projectName) + '>\n');
        }
    }

    var questions = [
        {
            name: 'userName',
            message: chalk.green.bold('Hello!') + ' Looks like we\'ve never met before. What is your name, ' +
            chalk.yellow('cowboy') + '?',
            when: function() {
                return !config.getName()
            }
        },
        {
            when: function() {
                return !projectName || _isNameOccupied(projectName);
            },
            name: 'projectNameConfirm',
            default: projectName && !_isNameOccupied(projectName) ? projectName : folderName,
            message: function(ans) {
                var name = config.getName();

                if (!name) {
                    name = ans.userName;
                    message('\n  Well, nice to meet you, ' + chalk.cyan(name) + '!\n');
                }

                return chalk.cyan(name) + ', what is the name of the project?';
            }
        },
        {
            when: function(ans) {
                return ans.projectNameConfirm || projectName;
            },
            type: 'confirm',
            name: 'imagesConfirm',
            message: function(ans) {
                var name = config.getName();

                if (!ans.projectNameConfirm && !name) {
                    name = ans.userName;
                    message('\n  Well, nice to meet you, ' + chalk.cyan(name) + '!\n');
                }

                var text = !projectName ? 'Do you wish your images to be optimized?' : chalk.cyan(name) +
                ', do you wish your images to be optimized?';

                return text;
            },
            default: true
        },
        {
            when: function(ans) {
                return ans.imagesConfirm && (ans.projectNameConfirm || projectName);
            },
            name: 'imagesPath',
            message: chalk.green('Great') + '! I\'m going to need a ' + chalk.yellow('RELATIVE') +
            ' path to the images folder then. \n  ' +
            'You can write several paths separated with a semicolon like so: \n  ' +
            chalk.green('path/to/some/folder/') + ';' + chalk.blue('another/one/here/') + '\n  ' +
            chalk.grey(path.normalize(process.cwd() + '/')) + '>'
        },
        {
            when: function(ans) {
                return ans.projectNameConfirm || projectName;
            },
            type: 'list',
            choices: [
                {
                    name: 'I\'ll be fine with good old CSS',
                    value: false
                },
                {
                    name: 'LESS',
                    value: 'less'
                },
                //{
                //    name: 'Sass',
                //    value: 'sass'
                //},
                //{
                //    name: 'Stylus',
                //    value: 'stylus'
                //}
            ],
            message: 'Do you want to use a style pre-processor?',
            default: true,
            name: 'styleProcessor'
        },
        {
            when: function(ans) {
                return ans.styleProcessor && (ans.projectNameConfirm || projectName);
            },
            name: 'stylePath',
            message: chalk.green('Great') + '! I\'m going to need a ' + chalk.magenta('RELATIVE') +
            ' path to the style-file then. \n  ' +
            'You can write several paths separated with a semicolon like so: \n  ' +
            chalk.green('path/to/some/file.less') + ';' + chalk.blue('another/one/here.less') + '\n  ' +
            chalk.grey(path.normalize(process.cwd() + '/')) + '>'
        },
        {
            when: function(ans) {
                return ans.styleProcessor && (ans.projectNameConfirm || projectName);
            },
            name: 'styleCssPath',
            default: 'same folder',
            message: 'Alright, we have a generated ' + chalk.magenta('CSS-file') +
            ' (or even several files) here. Where do I put it?\n  ' + chalk.grey(process.cwd()) + '>'
        },
        {
            when: function(ans) {
                return ans.styleProcessor && (ans.projectNameConfirm || projectName);
            },
            type: 'confirm',
            name: 'styleAutoprefixConfirm',
            message: 'Do you want to use Autoprefixer?'
        },
        {
            when: function(ans) {
                return ans.styleAutoprefixConfirm && (ans.projectNameConfirm || projectName);
            },
            name: 'styleAutoprefixParam',
            default: 'last 3 versions',
            message: 'Autoprefixer param is '
        },
        {
            when: function(ans) {
                return ans.projectNameConfirm || projectName;
            },
            name: 'spriteConfirm',
            message: function(ans) {
                var name = config.getName() ? config.getName() : ans.userName;
                return chalk.cyan(name) + ', do you want me to build ' + chalk.green('sprites') + ' for you?'
            },
            type: 'confirm',
            default: true
        },
        {
            name: 'spriteImagesPath',
            message: 'Well... Where is the sprite images/parts folder? \n ' +
            chalk.grey(path.normalize(process.cwd() + '/')) + '>',
            when: function(ans) {
                return ans.spriteConfirm && (ans.projectNameConfirm || projectName);
            }
        },
        {
            name: 'spritePath',
            message: 'And where do I put a sprite? \n ' + chalk.grey(process.cwd()) + '>',
            when: function(ans) {
                return ans.spriteConfirm && (ans.projectNameConfirm || projectName);
            }
        },
        {
            name: 'spriteCssPath',
            message: 'Got it! Almost forgot, I need to know where do I put generated sprite-styles file...\n' +
            chalk.grey(process.cwd()) + '>',
            when: function(ans) {
                return ans.spriteConfirm && (ans.projectNameConfirm || projectName);
            }
        }

    ];
    inquirer.prompt(questions, function(ans) {
        settings.name = ans.projectNameConfirm;
        settings.path = path.normalize(projectPath + '/');

        var userName = config.getName() ? config.getName() : ans.userName;

        if (!config.getName()) {
            config.setName(ans.userName);
        }

        if (_isNameOccupied(settings.name)) {
            message('\n' + userName + ', you already have a project with this name - <' + settings.name +
            '>', 'white', 'bgRed');
            process.exit();
        }

        message('\n-__-\n', 'green');
        message('\n  So, this is what we have here:\n  ');

        settings.active = true;

        if (ans.styleProcessor) {
            settings.styleProcessor    = ans.styleProcessor;
            settings.stylePath         = ans.stylePath.split(';');
            settings.styleCssPath      =
                ans.styleCssPath === 'same folder' ? path.dirname(ans.stylePath) : ans.styleCssPath;
            settings.styleAutoprefixer = ans.autoPrefixConfirm ? ans.autoPrefixParam : false;

            console.log('  ' + chalk.grey('CSS Pre-processing') + ' -- ' + chalk.green(ans.styleProcessor));
            console.log('  ' + chalk.grey('Styles source path') + ' -- ' + chalk.green(ans.stylePath));
            console.log('  ' + chalk.grey('CSS destination path') + ' -- ' + chalk.green(ans.styleCssPath));

            if (settings.styleAutoprefixer) {
                console.log('  ' + chalk.grey('Autoprefixer param') + ' -- ' + chalk.green(settings.styleAutoprefixer));
            }
            console.log('');
        }

        if (ans.imagesConfirm) {
            settings.imagesPath = ans.imagesPath.split(';');
            console.log('  ' + chalk.grey('Images path') + ' -- ' + chalk.green(ans.imagesPath));
            console.log('');
        }
        if (ans.spriteConfirm) {
            settings.spriteSourcePath = ans.spriteImagesPath;
            settings.spritePath       = ans.spritePath;
            settings.spriteCssPath    = ans.spriteCssPath;
            console.log('  ' + chalk.grey('Sprite source path') + ' -- ' + chalk.green(ans.spriteImagesPath));
            console.log('  ' + chalk.grey('Generated sprite path') + ' -- ' + chalk.green(ans.spritePath));
            console.log('  ' + chalk.grey('Generated sprite style path') + ' -- ' + chalk.green(ans.spriteCssPath));
            console.log('');
        }

        config.addProject(settings);

        message('Looks like this is it, ' + chalk.cyan(userName) + '.');
        message('You can run the bundler with ' + chalk.green('shakal run') + '.');
        message('If you made a mistake during the project adding somewhere you can fix that with ' +
        chalk.green('shakal config ' + settings.name) + '.');
        message('\nMay the force be with you, ' + chalk.yellow('young padawan') + '.');
    });
}

function add(projectName) {
    var currentPath = process.cwd();

    message('Started new project initialization in ' + chalk.green(currentPath));

    setup(projectName, currentPath);
}

module.exports = add;