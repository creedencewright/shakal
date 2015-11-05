var chalk = require("chalk");

var message = function(text, textColor, bgColor) {
    if (textColor) {
        if (bgColor) {
            console.log(chalk[bgColor][textColor](text))
        } else {
            console.log(chalk[textColor](text))
        }
    } else {
        console.log(text);
    }
}

module.exports = message;