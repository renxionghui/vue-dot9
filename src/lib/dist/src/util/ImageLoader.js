"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
import { filter } from 'vue/types/umd';
 * @Descripttion: 图片下载
 * @Date: 2020-07-25 17:00:09
 */
var ImageLoader = /** @class */ (function () {
    function ImageLoader() {
    }
    /**
     * @msg: 下载图片转换成dataUrl,绘制在画布上,得到需要处理的原始ImageData
     * @param 图片地址
     * @return: 图片下载数据Promise
     */
    ImageLoader.load = function (source, filter) {
        if (filter === void 0) { filter = 'none'; }
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
                    image.style.filter = filter;
                    document.body.appendChild(image);
                    image.style.display = 'none';
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context === null || context === void 0 ? void 0 : context.drawImage(image, 0, 0);
                    // document.removeChild(image)
                    resolve(context === null || context === void 0 ? void 0 : context.getImageData(0, 0, image.width, image.height));
                };
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    return ImageLoader;
}());
exports.default = ImageLoader;
