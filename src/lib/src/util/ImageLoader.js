"use strict";
exports.__esModule = true;
var ImageLoader = /** @class */ (function () {
    function ImageLoader() {
    }
    ImageLoader.load = function (url) {
        return new Promise(function (resolve, reject) {
            fetch(url).then(function (res) {
                return res.blob();
            }).then(function (blob) {
                var reader = new FileReader();
                reader.readAsDataURL(new Blob([blob]));
                reader.onload = function (e) {
                    resolve(e.target.result);
                };
            })["catch"](function (err) {
                reject(err);
            });
        });
    };
    return ImageLoader;
}());
exports["default"] = ImageLoader;
