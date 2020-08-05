"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Descripttion: 类似于android开发中的.9图片,图片拉伸不失真
 * @Date: 2020-07-25 16:43:50
 */
var ImageLoader_1 = __importDefault(require("./util/ImageLoader"));
var ImageFactory_1 = __importDefault(require("./util/ImageFactory"));
var Dot9 = /** @class */ (function () {
    /**
     * @param el 需要生成设置图片背景的dom
     * @param options 设置对应的参数
     * @param options.source 图片地址
     * @param options.sliceVertical 垂直方向上分割的坐标位置
     * @param options.sliceHorizontal 水平方向上分割的坐标位置
     */
    function Dot9(el, options) {
        this.el = el;
        this.options = options;
    }
    /**
     * 请求图片数据,创建背景图片
     */
    Dot9.prototype.create = function () {
        var _this = this;
        var _a = this.options, source = _a.source, sliceHorizontal = _a.sliceHorizontal, sliceVertical = _a.sliceVertical;
        ImageLoader_1.default.load(source).then(function (imageData) {
            var _a = getComputedStyle(_this.el), width = _a.width, height = _a.height;
            var targetW = parseInt(width, 10);
            var targetH = parseInt(height, 10);
            var factory = new ImageFactory_1.default(imageData, targetW, targetH);
            var image = factory.createImage(sliceHorizontal, sliceVertical);
            _this.el.style.cssText += "background-image:url('" + image + "');background-repeat:no-repeat;background-size:100% 100%";
        }).catch(function (err) {
            console.error(err);
        });
    };
    return Dot9;
}());
exports.default = Dot9;
