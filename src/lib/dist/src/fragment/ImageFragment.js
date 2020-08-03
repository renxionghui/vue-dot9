"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ImageFragment = (function () {
    function ImageFragment(sx, sy, dataSource) {
        this.sx = sx;
        this.sy = sy;
        this.sw = dataSource.width;
        this.sh = dataSource.height;
        this.dataSource = dataSource;
    }
    ImageFragment.prototype.getData = function () {
        return this.dataSource;
    };
    return ImageFragment;
}());
exports.default = ImageFragment;
