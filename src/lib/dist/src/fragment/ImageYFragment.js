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
 * 向Y轴拉伸的Image片段
 */
var ImageFragment_1 = __importDefault(require("./ImageFragment"));
var ImageYFragment = /** @class */ (function (_super) {
    __extends(ImageYFragment, _super);
    /**
     * @param th 拉伸的目标高度
     */
    function ImageYFragment(sx, sy, sourceData, th) {
        var _this = _super.call(this, sx, sy, sourceData) || this;
        _this.th = th;
        return _this;
    }
    /**
     * 将1像素高度,sw宽度的颜色拉伸到th高度
     * @return: 沿Y轴拉伸的图片数据
     */
    ImageYFragment.prototype.getData = function () {
        var _a = this, sw = _a.sw, th = _a.th, sourceData = _a.sourceData;
        var pxData = sourceData.data;
        var targetArray = new Uint8ClampedArray(sw * th * 4);
        for (var y = 0; y < th; y++) {
            for (var x = 0; x < sw * 4; x++) {
                targetArray[x + y * sw * 4] = pxData[x % (sw * 4)];
            }
        }
        var targetData = new ImageData(targetArray, sw, th);
        return targetData;
    };
    return ImageYFragment;
}(ImageFragment_1.default));
exports.default = ImageYFragment;
