var fs    = require('fs');
var path  = require('path');
var chalk = require('chalk');

var HOME_DIRECTORY = path.normalize(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']);
var CONFIG_PATH    = HOME_DIRECTORY + '/.shakal.config.json';

var names = ['Cowboy', 'Young padawan', 'Web Developer', 'Friend', 'Developer', 'Colleague'];

var config = {
    _data: _getConfigFile(),
    getDependencies: function() {
        return this._data.deps;
    },
    updateDependencies: function() {
        var deps = this.getDependencies();
        this._installDeps(deps, function() {
            console.log(chalk.green('\nDone!\n') + chalk.yellow(deps.join(' ')));
        })
    },
    setDependencies: function(dependencies) {
        this._data.deps = this._data.deps.concat(dependencies);
        this._data.deps = this._data.deps.filter(function(dep, i) {
            return this._data.deps.indexOf(dep) === i
        }.bind(this));

        this._write();
    },
    getDirectory: function() {
        return path.normalize(path.dirname(process.argv[1]));
    },
    changeProjectState: function(projects, state) {
        this._data.projects.forEach(function(p, i) {
            if (projects.indexOf(p.name) !== -1) {
                this._data.projects[i].active = state;
            }
        }.bind(this));

        this._write();
    },
    isNameOccupied: function(name) {
        return this._data.projects.filter(function(p) { return p.name === name; }).length;
    },
    getRandomName: function() {
        return names[Math.floor(Math.random() * names.length)];
    },
    removeProjects: function(projects) {
        this._data.projects = this._data.projects.filter(function(p) { return projects.indexOf(p.name) === -1 });
        this._write();
    },
    _write: function() {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(this._data));
    },
    addProject: function(project, cb) {
        this.resolveDeps(project, function(dependencies) {
            if (dependencies.length) this.setDependencies(dependencies);

            this._data.projects.push(project);
            this._write();

            cb();
        }.bind(this));
    },
    updateProject: function(project, cb) {
        this.resolveDeps(project, function(dependencies) {
            var projectToUpdate = this.getProjectByName(project.name);
            var i               = this._data.projects.indexOf(projectToUpdate);

            this._data.projects[i] = project;
            this._write();

            cb();
        }.bind(this));
    },
    setName: function(name) {
        this._data.userName = name;
        this._write();
    },
    getName: function() {
        return this._data.userName;
    },
    getProjectByName: function(name) {
        return this._data.projects.filter(function(p) {return p.name === name})[0];
    },
    getProjects: function(onlyActive) {
        if (onlyActive) {
            return this._data.projects.filter(function(p) {return p.active;});
        }
        return this._data.projects;
    },
    _installDeps: function(dependencies, cb) {
        console.log(chalk.green('Go grab a cup of coffee') + ', ' + chalk.cyan(this.getName()) +
            '! I\'m going to install ' + chalk.yellow(dependencies.join(' ')) + '\n');

        this.setDependencies(dependencies);

        var moduleDir = path.dirname(process.argv[1]);
        var exec      = require('child_process').exec;
        var install   = exec('npm i ' + dependencies.join(' '), {cwd: moduleDir});
        install.stdout.on('data', function(data) {
            console.log(data);
        });
        install.stderr.on('data', function(data) {
            console.log(data);
        });
        install.stderr.on('close', function() {
            cb(dependencies);
        });
    },

    resolveDeps: function(project, cb) {
        console.log('\nChecking dependencies...');
        var dependencies = [];
        if (project.styleProcessor) {
            try {
                require.resolve('gulp-less');
            } catch (err) {
                dependencies.push('gulp-less');
            }
            try {
                require.resolve('gulp-csso');
            } catch (err) {
                dependencies.push('gulp-csso');
            }
            try {
                require.resolve('gulp-livereload');
            } catch (err) {
                dependencies.push('gulp-livereload');
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
                require.resolve('handlebars');
            } catch (err) {
                if (dependencies.indexOf('handlebars') === -1) dependencies.push('handlebars');
            }
            try {
                require.resolve('svg-sprite');
            } catch (err) {
                if (dependencies.indexOf('svg-sprite') === -1) dependencies.push('svg-sprite');
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
            this._installDeps(dependencies, cb);
        } else {
            console.log(chalk.green('OK\n'));
            cb([]);
        }
    }
}

function _getConfigFile() {
    try {
        fs.accessSync(CONFIG_PATH);
        return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch (e) {
        return {projects: [], userName: '', deps: []};
    }
}

module.exports = config;