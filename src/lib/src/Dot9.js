"use strict";
exports.__esModule = true;
/*
 * @Descripttion: 类似于android开发中的.9图片,图片拉伸不失真
 * @Date: 2020-07-25 16:43:50
 */
var ImageLoader_1 = require("./util/ImageLoader");
var ImageFactory_1 = require("./util/ImageFactory");
var Dot9 = /** @class */ (function () {
    /**
     * @param el 需要生成设置图片背景的dom
     * @param options 设置对应的参数
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
        var _a = this.options, source = _a.source, sliceVertical = _a.sliceVertical, sliceHorizontal = _a.sliceHorizontal;
        ImageLoader_1["default"].load(source).then(function (imageData) {
            var _a = getComputedStyle(_this.el), width = _a.width, height = _a.height;
            var targetW = parseInt(width, 10);
            var targetH = parseInt(height, 10);
            var factory = new ImageFactory_1["default"](imageData, targetW, targetH);
            var image = factory.createImage(sliceVertical, sliceHorizontal);
            _this.el.style.backgroundImage = "url(" + image + ")";
        });
    };
    return Dot9;
}());
exports["default"] = Dot9;
