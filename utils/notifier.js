var notifier = require('node-notifier');
var config = require('../config');
var path = require('path');

var BASE = {
    sound: false,
    icon: path.join(config.getDirectory(), 'assets', 'icon.png')
};

module.exports = function(title, msg) {
    notifier.notify(Object.assign({}, BASE, {
        title: title ? title : 'SHAKAL',
        message: msg
    }));
};