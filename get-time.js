module.exports = function() {
    var d = new Date();

    return addZero(d.getHours()) + ':' + addZero(d.getMinutes()) + ':' + addZero(d.getSeconds());
}

function addZero(num) {
    if (num < 10) {
        num = "0" + num;
    }
    return num;
}