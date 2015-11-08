var fs   = require('fs');
var path = require('path');
var chalk = require('chalk');

var DIRECTORY   = path.dirname(process.argv[1]);
var CONFIG_PATH = DIRECTORY + '/config.json';

var names = ['Cowboy', 'Young padawan', 'Web Developer', 'Friend', 'Developer'];

var data = _getConfig();

function _getConfig() {
    try {
        fs.accessSync(CONFIG_PATH);
        return fs.readFileSync(CONFIG_PATH, 'utf8');
    } catch(e) {
        return {projects: [], userName: ''};
    }
}

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
    addProject: function(project, cb) {
        _resolveDependencies(project, function() {
            data.projects.push(project);
            config._write();

            cb();
        });
    },
    updateProject: function(project, cb) {
        _resolveDependencies(project, function() {
            var projectToUpdate = config.getProject(project.name);
            var i               = data.projects.indexOf(projectToUpdate);
            data.projects[i]    = project;
            config._write();

            cb();
        });
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

var _resolveDependencies = function(project, cb) {
    console.log('\nChecking dependencies...');
    var dependencies = [];
    if (project.styleProcessor) {
        try {
            require.resolve('gulp-less');
        } catch (err) {
            dependencies.push('gulp-less');
        }
        try {
            require.resolve('gulp-minify-css');
        } catch (err) {
            dependencies.push('gulp-minify-css');
        }

        if (project.styleAutoprefixer) {
            try {
                require.resolve('gulp-autoprefixer');
            } catch (err) {
                dependencies.push('gulp-autoprefixer');
            }
        }
    }

    if (project.imagesPath) {
        try {
            require.resolve('gulp-imagemin');
        } catch (err) {
            dependencies.push('gulp-imagemin');
        }
        try {
            require.resolve('imagemin-pngquant');
        } catch (err) {
            dependencies.push('imagemin-pngquant');
        }
    }

    if (project.spriteSourcePath) {
        try {
            require.resolve('gulp-imagemin');
        } catch (err) {
            if (dependencies.indexOf('gulp-imagemin') === -1) dependencies.push('gulp-imagemin');
        }
        try {
            require.resolve('gulp.spritesmith');
        } catch (err) {
            dependencies.push('gulp.spritesmith');
        }
        try {
            require.resolve('imagemin-pngquant');
        } catch (err) {
            if (dependencies.indexOf('imagemin-pngquant') === -1) dependencies.push('imagemin-pngquant');
        }
    }

    if (dependencies.length) {
        console.log(chalk.green('Go grab a coffee') + ', ' + chalk.cyan(config.getName())+'! I\'m going to install '+chalk.yellow(dependencies.join(' '))+'\n');

        var moduleDir = path.dirname(process.argv[1]);
        var exec = require('child_process').exec;
        var install = exec('npm i ' + dependencies.join(' '), {cwd: moduleDir});
        install.stdout.on('data', function(data) {
            console.log(data);
        })
        install.stderr.on('data', function (data) {
            console.log(data);
        });
        install.stderr.on('close', function () {
            cb();
        });
    } else {
        console.log(chalk.green('OK\n'));
        cb();
    }
};

module.exports = config;