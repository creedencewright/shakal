var chalk = require("chalk");
var message = require("./message");

function list(projects, onlyActive) {
    var projects = projects.filter(function(p) {return onlyActive ? p.active : p});

    var headText = onlyActive ? 'These are your '+ chalk.green('active') +' projects, son:' : 'These are your projects, son:';
    message('\n' + headText);
    projects.forEach(function(p) {
        var text = p.active ? chalk.green(p.name) : chalk.grey(p.name);
        message(text);
    });
}

module.exports = list;