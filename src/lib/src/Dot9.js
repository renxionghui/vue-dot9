"use strict";
exports.__esModule = true;
var ImageLoader_1 = require("./ImageLoader");
var Dot9 = /** @class */ (function () {
    function Dot9(el, options) {
        this.el = el;
        this.options = options;
    }
    Dot9.prototype.create = function () {
        var url = this.options.url;
        ImageLoader_1["default"].load(url).then(function (data) {
            console.log(data);
        });
    };
    return Dot9;
}());
exports["default"] = Dot9;
