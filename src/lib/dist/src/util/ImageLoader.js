"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * 图片加载
 */
var ImageLoader = /** @class */ (function () {
    function ImageLoader() {
    }
    /**
     * @msg: 加载图片,得到需要处理的原始ImageData
     * @param 图片地址
     * @return: 图片下载数据Promise
     */
    ImageLoader.load = function (source) {
        var image = new Image();
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        return new Promise(function (resolve, reject) {
            image.src = source;
            image.addEventListener('load', function () {
                var ratio = window.devicePixelRatio || 1;
                var width = image.width, height = image.height;
                canvas.width = width;
                canvas.height = height;
                context.drawImage(image, 0, 0, width, height);
                resolve(context.getImageData(0, 0, width, height));
            }, { once: true });
            image.addEventListener('error', function (error) {
                reject(error);
            }, { once: true });
        });
    };
    return ImageLoader;
}());
exports.default = ImageLoader;
