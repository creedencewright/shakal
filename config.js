var fs   = require('fs');
var path = require('path');

var DIRECTORY   = path.dirname(process.argv[1]);
var CONFIG_PATH = DIRECTORY + '/config.json';

var names = ['Cowboy', 'Young padawan', 'Web Developer', 'Friend', 'Developer'];

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
    getRandomName: function() {
        return names[Math.floor(Math.random() * names.length)];
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
    updateProject: function(project) {
        var projectToUpdate = config.getProject(project.name);
        var i               = data.projects.indexOf(projectToUpdate);
        data.projects[i]    = project;
        config._write();
    },
    setName: function(name) {
        data.userName = name;
        config._write();
    },
    getName: function() {
        return data.userName;
    },
    getProject: function(name) {
        return data.projects.filter(function(p) {return p.name === name})[0];
    },
    getProjects: function(onlyActive) {
        if (onlyActive) {
            return data.projects.filter(function(p) {return p.active;});
        }
        return data.projects;
    }
}

module.exports = config;