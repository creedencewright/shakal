#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
var list    = require('./list');
var add     = require('./add');
var run     = require('./run');
var chalk   = require('chalk');
var config  = require('./config');
var message = require('./message');

var command;

program
    .version('0.2.6')

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
        message('\nDone! This was easy!\n' + chalk.green(projectName.join(', ')), 'white');
    });

program
    .command('deactivate <projectName...>')
    .action(function(projectName) {
        command = true;
        config.changeProjectState(projectName, false);
        message('\nDone! This was easy!\n' + chalk.grey(projectName.join(', ')), 'white');
    });

program
    .command('remove <projectName...>')
    .action(function(projectName) {
        command = true;
        config.removeProjects(projectName);
        message('\nDone!\n' + chalk.grey(projectName.join(', ')), 'red');
    });

program
    .command('add [projectName]')
    .action(function(projectName) {
        command = true;
        add(projectName);
    });

program
    .command('run')
    .action(function(projectName) {
        command = true;
        run();
    });

program.parse(process.argv);

if (!command) {
    program.help();
}