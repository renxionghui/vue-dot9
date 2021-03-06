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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * 向X轴拉伸的Image片段
 */
var ImageFragment_1 = __importDefault(require("./ImageFragment"));
var ImageXFragment = /** @class */ (function (_super) {
    __extends(ImageXFragment, _super);
    /**
     * @param tw 拉伸的目标宽度
     */
    function ImageXFragment(sx, sy, sourceData, tw) {
        var _this = _super.call(this, sx, sy, sourceData) || this;
        _this.tw = tw;
        return _this;
    }
    /**
     * 将1像素宽度,sh高度的颜色拉伸到tw宽度
     * @return: 沿X轴拉伸的图片数据
     */
    ImageXFragment.prototype.getData = function () {
        var _a = this, sh = _a.sh, tw = _a.tw, sourceData = _a.sourceData;
        var pxData = sourceData.data;
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
}(ImageFragment_1.default));
exports.default = ImageXFragment;
