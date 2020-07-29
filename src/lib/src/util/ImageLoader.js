"use strict";
exports.__esModule = true;
/*
 * @Descripttion: 图片下载
 * @Date: 2020-07-25 17:00:09
 */
var ImageLoader = /** @class */ (function () {
    function ImageLoader() {
    }
    /**
     * @msg: 图片下载转成dataUrl
     * @param {string} 图片地址
     * @return: 图片下载数据Promise
     */
    ImageLoader.load = function (source) {
        var image = new Image();
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        return new Promise(function (resolve, reject) {
            fetch(source).then(function (res) {
                return res.blob();
            }).then(function (blob) {
                var reader = new FileReader();
                reader.readAsDataURL(new Blob([blob]));
                reader.onload = function (e) {
                    var _a;
                    if (typeof ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) === 'string') {
                        image.src = e.target.result;
                    }
                };
                image.onload = function () {
                    context === null || context === void 0 ? void 0 : context.drawImage(image, 0, 0);
                    resolve(context === null || context === void 0 ? void 0 : context.getImageData(0, 0, image.width, image.height));
                };
            })["catch"](function (err) {
                reject(err);
            });
        });
    };
    return ImageLoader;
}());
exports["default"] = ImageLoader;
