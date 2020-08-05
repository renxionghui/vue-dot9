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
 * 向X轴,Y轴同时拉伸的Image片段
 */
var ImageFragment_1 = __importDefault(require("./ImageFragment"));
var ImageFillFragment = /** @class */ (function (_super) {
    __extends(ImageFillFragment, _super);
    /**
     * @param tw 拉伸的目标宽度
     * @param th 拉伸的目标高度
     */
    function ImageFillFragment(sx, sy, sourceData, tw, th) {
        var _this = _super.call(this, sx, sy, sourceData) || this;
        _this.tw = tw;
        _this.th = th;
        return _this;
    }
    /**
     * @return: 沿XY轴拉伸的图片数据
     */
    ImageFillFragment.prototype.getData = function () {
        var _a = this, tw = _a.tw, th = _a.th, sourceData = _a.sourceData;
        var targetArray = new Uint8ClampedArray(tw * th * 4);
        for (var y = 0; y < th; y++) {
            for (var x = 0; x < tw * 4; x++) {
                targetArray[x + y * tw * 4] = sourceData.data[x % 4];
            }
        }
        var targetData = new ImageData(targetArray, tw, th);
        return targetData;
    };
    return ImageFillFragment;
}(ImageFragment_1.default));
exports.default = ImageFillFragment;
