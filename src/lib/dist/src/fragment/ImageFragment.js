"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Descripttion: Image片段,包含原始坐标,原始宽高,原始图片数据等信息
 * @Date: 2020-07-27 09:27:20
 */
var ImageFragment = /** @class */ (function () {
    /**
     * @param sx 数据原始X轴坐标
     * @param sy 数据原始Y轴坐标
     * @param dataSource 原始图片数据
     */
    function ImageFragment(sx, sy, dataSource) {
        this.sx = sx;
        this.sy = sy;
        this.sw = dataSource.width;
        this.sh = dataSource.height;
        this.dataSource = dataSource;
    }
    /**
     * @return: 返回图片数据
     */
    ImageFragment.prototype.getData = function () {
        return this.dataSource;
    };
    return ImageFragment;
}());
exports.default = ImageFragment;
