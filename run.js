var chalk   = require("chalk");
var config  = require('./config');
var gulp    = require('gulp');

var projects = config.getProjects(true);

function run() {
    var tasks = [];
    projects.forEach(function(project) {
        console.log(chalk.green('\n' + project.name + '\n---'));

        if (project.styleProcessor) { require('./tasks/style')(project); }
        if (project.spriteSourcePath) { require('./tasks/sprite')(project); }
        if (project.imagesPath) { require('./tasks/image')(project); }

        require('./tasks/watch')(project);

        tasks.push(project.name + "_watch");
    });

    gulp.task('default', tasks);
    gulp.start('default');
}

module.exports = run;