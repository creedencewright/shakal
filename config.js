var fs   = require('fs');
var path = require('path');

var DIRECTORY = path.dirname(process.argv[1]);
var CONFIG_PATH = DIRECTORY + '/config.json';

var data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

var config = {
    changeProjectState: function(projects, state) {
        data.projects.forEach(function(p, i) {
            if (projects.indexOf(p.name) !== -1) {
                data.projects[i].active = state;
            }
        });

        config._write();
    },
    isNameOccupied: function(name) {
        return data.projects.filter(function(p) { return p.name === name; }).length;
    },
    removeProjects: function(projects) {
        data.projects = data.projects.filter(function(p) { return projects.indexOf(p.name) === -1 });
        config._write();
    },
    _write: function() {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(data));
    },
    addProject: function(project) {
        data.projects.push(project);
        config._write();
    },
    setName: function(name) {
        data.userName = name;
        config._write();
    },
    getName: function() {
        return data.userName;
    },
    getProjects: function(onlyActive) {
        if (onlyActive) {
            return data.projects.filter(function(p) {return p.active;});
        }
        return data.projects;
    }
}

module.exports = config;