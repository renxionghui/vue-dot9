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
        if (!sliceVertical || sliceVertical.length === 0) {
            sliceVertical = [Math.floor(sourceW / 2)];
        }
        if (!sliceHorizontal || sliceHorizontal.length === 0) {
            sliceHorizontal = [Math.floor(sourceH / 2)];
        }
        if (targetW < sourceW || targetH < sourceH || (targetW === sourceW && targetH === sourceH)) {
            this.imageFragments.push(new ImageFragment_1["default"](0, 0, this.imageData));
        }
        else if (targetW > sourceW && targetH === sourceH) { //只拉伸X轴
            sliceHorizontal = [];
        }
        else if (targetW === sourceW && targetH > sourceH) {
            // this.createYFragments(sliceHorizontal)
            sliceVertical = [];
        }
        else {
            // sliceVertical = [];
            // this.createXYFragment(sliceVertical, sliceHorizontal);
        }
        this.sliceTop(sliceVertical, sliceHorizontal);
        this.sliceRight(sliceVertical, sliceHorizontal);
        this.sliceBottom(sliceVertical, sliceHorizontal);
    };
    /**
     * 合并图片数据
     */
    ImageFactory.prototype.merge = function () {
        return this.targetCanvas.toDataURL();
    };
    ImageFactory.prototype.sliceTop = function (sliceVertical, sliceHorizontal) {
        var _a = this.imageData, width = _a.width, height = _a.height;
        var targetW = this.targetW;
        var context = this.targetCanvas.getContext('2d');
        var len = sliceVertical.length;
        var sy = 0;
        var sh = sliceHorizontal.length ? sliceHorizontal[0] : height / 2;
        if (len === 0) {
            var sx = 0;
            var sw = width / 2;
            var dataSource = this.getData(sx, sy, sw, sh);
            context === null || context === void 0 ? void 0 : context.putImageData(dataSource, sx, sy);
            return;
        }
        var aw = Math.floor((targetW - width) / len);
        var sxs = [0];
        var txs = [0];
        for (var i = 0; i < len; i++) {
            sxs.push(sliceVertical[i]);
            txs.push(sliceVertical[i] + aw * i);
            txs.push(sliceVertical[i] + aw * (i + 1));
        }
        for (var i = 0; i < len; i++) {
            //原数据
            var osx = sxs[i];
            var osy = sy;
            var osw = sxs[i + 1] - sxs[i];
            var osh = sh;
            var oData = this.getData(osx, osy, osw, osh);
            context === null || context === void 0 ? void 0 : context.putImageData(oData, txs[2 * i], osy);
            //沿X轴拉伸的数据
            var xsx = sxs[i + 1];
            var xsy = sy;
            var xsw = 1;
            var xsh = sh;
            var xData = this.getData(xsx, xsy, xsw, xsh);
            var xFragment = new ImageXFragment_1["default"](xsx, xsy, xData, aw);
            context === null || context === void 0 ? void 0 : context.putImageData(xFragment.getData(), txs[2 * i + 1], xsy);
        }
    };
    ImageFactory.prototype.sliceRight = function (sliceVertical, sliceHorizontal) {
        var _a = this.imageData, width = _a.width, height = _a.height;
        var _b = this, targetW = _b.targetW, targetH = _b.targetH;
        var context = this.targetCanvas.getContext('2d');
        var len = sliceHorizontal.length;
        var sx = sliceVertical.length ? sliceVertical[sliceVertical.length - 1] : width / 2;
        var sw = sliceVertical.length ? width - sliceVertical[sliceVertical.length - 1] : width / 2;
        if (len === 0) {
            var sy = 0;
            var sh = height / 2;
            var dataSource = this.getData(sx, sy, sw, sh);
            context === null || context === void 0 ? void 0 : context.putImageData(dataSource, targetW - sw, sy);
            return;
        }
        var ah = Math.floor((targetH - height) / len);
        var sys = [0];
        var tys = [0];
        for (var i = 0; i < len; i++) {
            sys.push(sliceHorizontal[i]);
            tys.push(sliceHorizontal[i] + ah * i);
            tys.push(sliceHorizontal[i] + ah * (i + 1));
        }
        for (var i = 0; i < len; i++) {
            //原数据
            var osx = sx;
            var osy = sys[i];
            var osw = sw;
            var osh = sys[i + 1] - sys[i];
            var oData = this.getData(osx, osy, osw, osh);
            context === null || context === void 0 ? void 0 : context.putImageData(oData, osx, tys[2 * i]);
            //沿Y轴拉伸的数据
            var ysx = sx;
            var ysy = sys[i + 1];
            var ysw = sw;
            var ysh = 1;
            var yData = this.getData(ysx, ysy, ysw, ysh);
            var yFragment = new ImageYFragment_1["default"](ysx, ysy, yData, ah);
            context === null || context === void 0 ? void 0 : context.putImageData(yFragment.getData(), ysx, tys[2 * i + 1]);
        }
    };
    ImageFactory.prototype.sliceBottom = function (sliceVertical, sliceHorizontal) {
        var _a = this.imageData, width = _a.width, height = _a.height;
        var _b = this, targetW = _b.targetW, targetH = _b.targetH;
        var context = this.targetCanvas.getContext('2d');
        var len = sliceVertical.length;
        var sy = sliceHorizontal.length ? sliceHorizontal[sliceHorizontal.length - 1] : height / 2;
        var sh = sliceHorizontal.length ? targetH - sliceHorizontal[sliceHorizontal.length - 1] : height / 2;
        console.log(sh);
        if (len === 0) {
            var sx = 0;
            var sw = width / 2;
            var dataSource = this.getData(sx, sy, sw, sh);
            context === null || context === void 0 ? void 0 : context.putImageData(dataSource, sx, targetH - sy);
            console.log(targetH - sy);
            return;
        }
    };
    /**
     * 水平拉伸
     * @param sliceVertical 水平方向分割坐标数组
     */
    ImageFactory.prototype.createXFragments = function (sliceVertical) {
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
        var firstData = this.getData(0, 0, firstWidth, this.targetH);
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
            var xData = this.getData(xsx, xsy, xsw, this.targetH);
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
            var oData = this.getData(osx, osy, osw, this.targetH);
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
        this.createXFragments(sliceVertical);
        //左边
    };
    return ImageFactory;
}());
exports["default"] = ImageFactory;
