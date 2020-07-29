"use strict";
exports.__esModule = true;
/*
 * @Descripttion: 将图片分割处理
 * @Date: 2020-07-27 09:18:19
 */
var ImageXFragment_1 = require("../fragment/ImageXFragment");
var ImageYFragment_1 = require("../fragment/ImageYFragment");
// import ImageXYFragment from '../fragment/ImageXYFragment';
var ImageFragment_1 = require("../fragment/ImageFragment");
var ImageFactory = /** @class */ (function () {
    /**
     * @param imageData:下载的图片数据
     * @param targetW: 最终图片的宽度
     * @param targetH: 最终图片的高度
     */
    function ImageFactory(imageData, targetW, targetH) {
        var _a;
        this.imageFragments = [];
        this.imageData = imageData;
        this.targetW = targetW;
        this.targetH = targetH;
        this.targetCanvas = document.createElement('canvas');
        this.targetCanvas.width = targetW;
        this.targetCanvas.height = targetH;
        this.sourceCanvas = document.createElement('canvas');
        this.sourceCanvas.width = imageData.width;
        this.sourceCanvas.height = imageData.height;
        (_a = this.sourceCanvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.putImageData(imageData, 0, 0);
    }
    ImageFactory.prototype.getData = function (sx, sy, sw, sh) {
        var _a;
        return ((_a = this.sourceCanvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.getImageData(sx, sy, sw, sh)) || new ImageData(0, 0);
    };
    ImageFactory.prototype.createImage = function (sliceVertical, sliceHorizontal) {
        this.slice(sliceVertical, sliceHorizontal);
        var image = this.merge();
        return image;
    };
    /**
     * 分割图片数据
     */
    ImageFactory.prototype.slice = function (sliceVertical, sliceHorizontal) {
        var _a = this.imageData, sourceW = _a.width, sourceH = _a.height;
        var _b = this, targetW = _b.targetW, targetH = _b.targetH;
        if (targetW < sourceW || targetH < sourceH || (targetW === sourceW && targetH === sourceH)) {
            this.imageFragments.push(new ImageFragment_1["default"](0, 0, this.imageData));
        }
        else if (targetW > sourceW && targetH === sourceH) { //只拉伸X轴
            this.createXFragments(sourceH, sliceVertical);
        }
        else if (targetW === sourceW && targetH > sourceH) {
            this.createYFragments(sliceHorizontal);
        }
        else {
            this.createXYFragment(sliceVertical, sliceHorizontal);
        }
    };
    /**
     * 合并图片数据
     */
    ImageFactory.prototype.merge = function () {
        var targetContext = this.targetCanvas.getContext('2d');
        for (var i = 0; i < this.imageFragments.length; i++) {
            var fragment = this.imageFragments[i];
            targetContext === null || targetContext === void 0 ? void 0 : targetContext.putImageData(fragment.getData(), fragment.sx, fragment.sy);
        }
        return this.targetCanvas.toDataURL();
    };
    /**
     * 水平拉伸
     * @param sliceVertical 水平方向分割坐标数组
     */
    ImageFactory.prototype.createXFragments = function (targetHeight, sliceVertical) {
        var sourceW = this.imageData.width;
        if (!sliceVertical || sliceVertical.length === 0) {
            var startX = Math.floor(sourceW / 3);
            var endX = Math.ceil(2 * sourceW / 3) - 1;
            sliceVertical = [startX, endX];
        }
        var len = sliceVertical.length;
        var sliceX = 0;
        //第一块为图片原数据
        var firstWidth = sliceVertical[0];
        var firstData = this.getData(0, 0, firstWidth, targetHeight);
        var firstFragment = new ImageFragment_1["default"](0, 0, firstData);
        this.imageFragments.push(firstFragment);
        sliceX += firstWidth;
        //计算平均拉伸宽度
        var averageWidth = Math.floor((this.targetW - sourceW) / (len / 2));
        //第二块开始循环:拉伸->原数据
        for (var i = 0; i < len / 2; i++) {
            //拉伸的数据
            var xsx = sliceVertical[2 * i];
            var xsy = 0;
            var xsw = sliceVertical[2 * i + 1] - sliceVertical[2 * i] + 1;
            var xData = this.getData(xsx, xsy, xsw, targetHeight);
            var xFragment = new ImageXFragment_1["default"](sliceX, xsy, xData, averageWidth + xsw);
            this.imageFragments.push(xFragment);
            sliceX += (averageWidth + xsw);
            //原数据
            var osx = sliceVertical[2 * i + 1] + 1;
            var osy = 0;
            var osw = 0;
            if (sliceVertical[2 * i + 2]) {
                osw = sliceVertical[2 * i + 2] - sliceX + 1;
            }
            else {
                osw = sourceW - sliceVertical[len - 1] - 1;
            }
            var oData = this.getData(osx, osy, osw, targetHeight);
            var oFragment = new ImageFragment_1["default"](sliceX, osy, oData);
            this.imageFragments.push(oFragment);
            sliceX += osw;
        }
    };
    /**
     * 垂直拉伸
     * @param sliceHorizontal 垂直拉伸坐标数组
     */
    ImageFactory.prototype.createYFragments = function (sliceHorizontal) {
        var _a = this.imageData, sourceW = _a.width, sourceH = _a.height;
        if (!sliceHorizontal || sliceHorizontal.length === 0) {
            var startY = Math.floor(sourceH / 3);
            var endY = Math.ceil(2 * sourceH / 3) - 1;
            sliceHorizontal = [startY, endY];
        }
        var len = sliceHorizontal.length;
        var sliceY = 0;
        //第一块为图片原数据
        var firstHeight = sliceHorizontal[0];
        var firstData = this.getData(0, 0, sourceW, firstHeight);
        var firstFragment = new ImageFragment_1["default"](0, 0, firstData);
        this.imageFragments.push(firstFragment);
        sliceY += firstHeight;
        //计算平均拉伸宽度
        var averageHeight = Math.floor((this.targetH - sourceH) / (len / 2));
        //第二块开始循环:拉伸->原数据
        for (var i = 0; i < len / 2; i++) {
            //拉伸的数据
            var ysx = 0;
            var ysy = sliceHorizontal[2 * i];
            var ysh = sliceHorizontal[2 * i + 1] - sliceHorizontal[2 * i] + 1;
            var yData = this.getData(ysx, ysy, sourceW, ysh);
            var yFragment = new ImageYFragment_1["default"](ysx, sliceY, yData, averageHeight + ysh);
            this.imageFragments.push(yFragment);
            sliceY += (averageHeight + ysh);
            //原数据
            var osx = 0;
            var osy = sliceHorizontal[2 * i + 1] + 1;
            var osh = 0;
            if (sliceHorizontal[2 * i + 2]) {
                osh = sliceHorizontal[2 * i + 2] - sliceY + 1;
            }
            else {
                osh = sourceW - sliceHorizontal[len - 1] - 1;
            }
            var oData = this.getData(osx, osy, sourceW, osh);
            var oFragment = new ImageFragment_1["default"](osx, sliceY, oData);
            this.imageFragments.push(oFragment);
            sliceY += osh;
        }
    };
    /**
     * 水平与垂直拉伸
     */
    ImageFactory.prototype.createXYFragment = function (sliceVertical, sliceHorizontal) {
        var _a = this.imageData, sourceW = _a.width, sourceH = _a.height;
        if (!sliceVertical || sliceVertical.length === 0) {
            var startX = Math.floor(sourceW / 3);
            var endX = Math.ceil(2 * sourceW / 3) - 1;
            sliceVertical = [startX, endX];
        }
        if (!sliceHorizontal || sliceHorizontal.length === 0) {
            var startY = Math.floor(sourceH / 3);
            var endY = Math.ceil(2 * sourceH / 3) - 1;
            sliceHorizontal = [startY, endY];
        }
        var vLen = sliceVertical.length;
        var hLen = sliceHorizontal.length;
        //平均拉伸宽度
        var aw = Math.floor((this.targetW - sourceW) / (vLen / 2));
        var ah = Math.floor((this.targetH - sourceH) / (hLen / 2));
        //上边
        var topTargetHeight = sliceHorizontal[0];
        this.createXFragments(topTargetHeight, sliceVertical);
    };
    return ImageFactory;
}());
exports["default"] = ImageFactory;
