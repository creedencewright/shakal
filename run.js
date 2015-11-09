var chalk   = require("chalk");
var config  = require('./config');
var gulp    = require('gulp');
var notify  = require('./utils/notifier');

var projects = config.getProjects(true);

function run(params) {
    var tasks = [];
    projects.forEach(function(project) {
        console.log(chalk.green('\n' + project.name + '\n---'));

        if (project.styleProcessor) { require('./tasks/style')(project, config, params); }
        if (project.spriteSourcePath) { require('./tasks/sprite')(project, config, params); }
        if (project.imagesPath) { require('./tasks/image')(project, config, params); }

        require('./tasks/watch')(project, config, project);

        tasks.push(project.name + "_watch");
    });

    if (params.notify) notify('', config.getName() + ', I am running here!');

    gulp.task('default', tasks);
    gulp.start('default');
}

module.exports = run;