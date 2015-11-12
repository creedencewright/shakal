#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program  = require('commander');
var list     = require('./list');
var add      = require('./add');
var run      = require('./run');
var chalk    = require('chalk');
var config   = require('./config');

program
    .version('0.2.11')

program
    .command('list')
    .option('--active', 'List only active projects')
    .action(function(options) {
        command = true;
        list(config.getProjects(), options.active)
    });

program
    .command('config <projectName>')
    .action(function(projectName) {
        command = true;
        add(projectName, true);
    });

program
    .command('activate <projectName...>')
    .action(function(projectName) {
        command = true;
        config.changeProjectState(projectName, true);
        console.log(chalk.white('\nDone! This was easy!\n' + chalk.green(projectName.join(', '))));
    });

program
    .command('deactivate <projectName...>')
    .action(function(projectName) {
        command = true;
        config.changeProjectState(projectName, false);
        console.log(chalk.white('\nDone! This was easy!\n' + chalk.grey(projectName.join(', '))));
    });

program
    .command('remove <projectName...>')
    .action(function(projectName) {
        command = true;
        config.removeProjects(projectName);
        console.log(chalk.red('\nDone!\n' + chalk.grey(projectName.join(', '))));
    });

program
    .command('add [projectName]')
    .action(function(projectName) {
        command = true;
        add(projectName);
    });

program
    .command('run')
    .option('-N, --notify', 'Turn on system notifications')
    .action(function(opts) {
        command = true;
        run(opts);
    });

program.parse(process.argv);

if (!command) {
    program.help();
}