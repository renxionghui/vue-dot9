"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ImageLoader_1 = __importDefault(require("./util/ImageLoader"));
var ImageFactory_1 = __importDefault(require("./util/ImageFactory"));
var Dot9 = (function () {
    function Dot9(el, options) {
        this.el = el;
        this.options = options;
    }
    Dot9.prototype.create = function () {
        var _this = this;
        var _a = this.options, source = _a.source, sliceVertical = _a.sliceVertical, sliceHorizontal = _a.sliceHorizontal;
        ImageLoader_1.default.load(source).then(function (imageData) {
            var _a = getComputedStyle(_this.el), width = _a.width, height = _a.height;
            var targetW = parseInt(width, 10);
            var targetH = parseInt(height, 10);
            var factory = new ImageFactory_1.default(imageData, targetW, targetH);
            var image = factory.createImage(sliceVertical, sliceHorizontal);
            _this.el.style.backgroundImage = "url(" + image + ")";
            _this.el.style.backgroundRepeat = 'no-repeat';
        });
    };
    return Dot9;
}());
exports.default = Dot9;
