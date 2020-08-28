"use strict";
/**
 * 滤镜
 */
var ImageFilter = /** @class */ (function () {
    function ImageFilter(filter) {
        this.filter = filter;
    }
    return ImageFilter;
}());
var Filter;
(function (Filter) {
    Filter[Filter["Gray"] = 0] = "Gray";
    Filter[Filter["GaussianBlur"] = 1] = "GaussianBlur";
})(Filter || (Filter = {}));
