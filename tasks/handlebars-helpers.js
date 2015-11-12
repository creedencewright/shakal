module.exports = {
    math: function(lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    },
    retinize: function(data, name) {
        return data.sprites.filter(function(s) {return s.name === name + '@2x';}).length !== 0;
    }
};