var inquirer = require("inquirer");

var message = require('./message');
var config  = require('./config');
var chalk   = require('chalk');
var path    = require('path');

//function getFiles(str) {
//    if (str.split('/').length > 1) {
//        var data = fs.readdirSync('./'+str);
//    } else {
//        var data = fs.readdirSync('./');
//    }
//    var files = [];
//
//    data.forEach(function(el) {
//        var re = '^'+str+'.*';
//        var regex = new RegExp(re);
//        var found = el.match(regex);
//
//        if (found !== null) {
//            files.push(el);
//        }
//    });
//
//    if (files.length === 1) {
//        var res = files[0].replace(str, '')
//        if (fs.lstatSync('./' + str + res).isDirectory()) {
//            return res + '/';
//        }
//        return res;
//    }
//    return false;
//}

inquirer.prompt.prompts.input.prototype.onKeypress = function(e) {
    if (e.key.name === 'tab') {
        this.rl.line = this.rl.line.trim();
        //var file = getFiles(this.rl.line);
        //if (file) {
        //    this.rl.line += file;
        //}
    }
    this.render();
};

function setup(projectName, projectPath, isConfig) {
    var folderName = path.basename(projectPath);
    var settings   = {};

    if (projectName) {
        message('Setting up ' + projectName.toUpperCase() + '...\n', 'green');
    }

    if (projectName) {
        if (config.isNameOccupied(projectName) && !isConfig) {
            console.log(chalk.bgYellow.black('Oops :( \n') + 'Looks like you already have a project with a name <' +
            chalk.bgRed.white(projectName) + '>\n');
        }
    }

    var questions = require('./questions')(projectName, folderName, config, isConfig);

    if (!questions.length) process.exit();

    inquirer.prompt(questions, function(ans) {
        if (isConfig) {
            var project = config.getProject(projectName);
        }

        settings.name = ans.projectNameConfirm ? ans.projectNameConfirm : projectName;
        settings.path = isConfig ? project.path : path.normalize(projectPath + '/');

        var userName = config.getName();

        if (!userName) {
            if (ans.userName) {
                userName = ans.userName;
                config.setName(userName);
            } else {
                userName = config.getRandomName();
            }
        }

        if (!isConfig && config.isNameOccupied(settings.name)) {
            message('\n' + userName + ', you already have a project with this name - <' + settings.name +
            '>', 'white', 'bgRed');
            process.exit();
        }

        message('\n-__-\n', 'green');
        message('So, this is what we have here:\n  ');

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
            console.log('  ' + chalk.grey('Images path') + ' -- ' + chalk.green(ans.imagesPath) + '\n');
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

        var saveCb = function() {
            console.log('____________________________\n');
            message('Looks like this is it, ' + chalk.cyan(userName) + '.');
            message('To run the bundler type ' + chalk.green('shakal run') + '.');
            message('If you made a mistake during the project initialization you can fix that with ' +
            chalk.green('shakal config ' + settings.name) + '.');
            message('\nMay the force be with you, ' + chalk.cyan(userName) + '.');
        }

        if (isConfig) {
            config.updateProject(settings);
        } else {
            config.addProject(settings, saveCb);
        }
    });
}

function add(projectName, isConfig) {
    var currentPath = process.cwd();

    if (!isConfig) {
        message('Started new project initialization in ' + chalk.green(currentPath));
    }

    setup(projectName, currentPath, isConfig);
}

module.exports = add;