"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/*
 * @Descripttion: 向X轴拉伸的Image片段
 * @Date: 2020-07-27 09:40:03
 */
var ImageFragment_1 = require("./ImageFragment");
var ImageXFragment = /** @class */ (function (_super) {
    __extends(ImageXFragment, _super);
    /**
     * @param tw 拉伸的目标宽度
     */
    function ImageXFragment(sx, sy, dataSource, tw) {
        var _this = _super.call(this, sx, sy, dataSource) || this;
        _this.tw = tw;
        return _this;
    }
    /**
     * @return: 沿X轴拉伸的图片数据
     */
    ImageXFragment.prototype.getData = function () {
        var _a = this, sw = _a.sw, sh = _a.sh, tw = _a.tw, dataSource = _a.dataSource;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = sw;
        canvas.height = sh;
        context === null || context === void 0 ? void 0 : context.putImageData(dataSource, 0, 0);
        var pxData = (context === null || context === void 0 ? void 0 : context.getImageData(0, 0, 1, sh).data) || [];
        var targetArray = new Uint8ClampedArray(tw * sh * 4);
        for (var y = 0; y < sh; y++) {
            for (var x = 0; x < tw * 4; x++) {
                targetArray[x + y * tw * 4] = pxData[x % 4 + y * 4];
            }
        }
        var targetData = new ImageData(targetArray, tw, sh);
        return targetData;
    };
    return ImageXFragment;
}(ImageFragment_1["default"]));
exports["default"] = ImageXFragment;
