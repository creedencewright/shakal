var chalk = require("chalk");

function list(projects, options) {
    var projects = projects.filter(function(p) {return options.active ? p.active : p});

    if (!projects.length) {
        console.log('Nothing here yet.');
        process.exit();
    }

    var headText = options.active ? 'These are your '+ chalk.green('active') +' projects, son:' : 'These are your projects, son:';
    console.log('\n' + headText);
    projects.forEach(function(p) {
        var text = p.active ? chalk.green(p.name) : chalk.grey(p.name);
        console.log(text);

        if (options.detail) {
            for (var key in p) {
                console.log(chalk.cyan(key + ': ') + p[key]);
            }

            console.log('');
        }
    });
}

module.exports = list;