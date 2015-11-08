var chalk = require("chalk");

function list(projects, onlyActive) {
    var projects = projects.filter(function(p) {return onlyActive ? p.active : p});

    if (!projects.length) {
        console.log('Nothing here yet.');
        process.exit();
    }

    var headText = onlyActive ? 'These are your '+ chalk.green('active') +' projects, son:' : 'These are your projects, son:';
    console.log('\n' + headText);
    projects.forEach(function(p) {
        var text = p.active ? chalk.green(p.name) : chalk.grey(p.name);
        console.log(text);
    });
}

module.exports = list;