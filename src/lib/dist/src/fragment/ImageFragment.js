"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Image片段,包含原始坐标,原始宽高,原始图片数据等信息
 */
var ImageFragment = /** @class */ (function () {
    /**
     * @param sx 数据原始X轴坐标
     * @param sy 数据原始Y轴坐标
     * @param sourceData 原始图片数据
     */
    function ImageFragment(sx, sy, sourceData) {
        this.sx = sx;
        this.sy = sy;
        this.sw = sourceData.width;
        this.sh = sourceData.height;
        this.sourceData = sourceData;
    }
    /**
     * @return: 返回图片数据
     */
    ImageFragment.prototype.getData = function () {
        return this.sourceData;
    };
    return ImageFragment;
}());
exports.default = ImageFragment;
