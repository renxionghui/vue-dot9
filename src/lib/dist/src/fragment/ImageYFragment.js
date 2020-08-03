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
var ImageFragment_1 = __importDefault(require("./ImageFragment"));
var ImageYFragment = (function (_super) {
    __extends(ImageYFragment, _super);
    function ImageYFragment(sx, sy, dataSource, th) {
        var _this = _super.call(this, sx, sy, dataSource) || this;
        _this.th = th;
        return _this;
    }
    ImageYFragment.prototype.getData = function () {
        var _a = this, sw = _a.sw, sh = _a.sh, th = _a.th, dataSource = _a.dataSource;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = sw;
        canvas.height = sh;
        context === null || context === void 0 ? void 0 : context.putImageData(dataSource, 0, 0);
        var pxData = (context === null || context === void 0 ? void 0 : context.getImageData(0, 0, sw, 1).data) || [];
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
