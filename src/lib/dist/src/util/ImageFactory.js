"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ImageXFragment_1 = __importDefault(require("../fragment/ImageXFragment"));
var ImageYFragment_1 = __importDefault(require("../fragment/ImageYFragment"));
var ImageFactory = (function () {
    function ImageFactory(imageData, targetW, targetH) {
        var _a;
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
            sliceHorizontal = [];
            sliceVertical = [];
        }
        else if (targetW > sourceW && targetH === sourceH) {
            sliceVertical = [];
        }
        else if (targetW === sourceW && targetH > sourceH) {
            sliceHorizontal = [];
        }
        this.sliceTop(sliceVertical, sliceHorizontal);
        this.sliceRight(sliceVertical, sliceHorizontal);
        this.sliceBottom(sliceVertical, sliceHorizontal);
        this.sliceLeft(sliceVertical, sliceHorizontal);
    };
    ImageFactory.prototype.merge = function () {
        return this.targetCanvas.toDataURL();
    };
    ImageFactory.prototype.sliceTop = function (sliceVertical, sliceHorizontal) {
        var _a = this.imageData, width = _a.width, height = _a.height;
        var targetW = this.targetW;
        var context = this.targetCanvas.getContext('2d');
        var len = sliceHorizontal.length;
        var sy = 0;
        var sh = sliceVertical.length ? sliceVertical[0] : height / 2;
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
            sxs.push(sliceHorizontal[i]);
            txs.push(sliceHorizontal[i] + aw * i);
            txs.push(sliceHorizontal[i] + aw * (i + 1));
        }
        for (var i = 0; i < len; i++) {
            var osx = sxs[i];
            var osy = sy;
            var osw = sxs[i + 1] - sxs[i];
            var osh = sh;
            var oData = this.getData(osx, osy, osw, osh);
            context === null || context === void 0 ? void 0 : context.putImageData(oData, txs[2 * i], osy);
            var xsx = sxs[i + 1];
            var xsy = sy;
            var xsw = 1;
            var xsh = sh;
            var xData = this.getData(xsx, xsy, xsw, xsh);
            var xFragment = new ImageXFragment_1.default(xsx, xsy, xData, aw);
            context === null || context === void 0 ? void 0 : context.putImageData(xFragment.getData(), txs[2 * i + 1], xsy);
        }
    };
    ImageFactory.prototype.sliceRight = function (sliceVertical, sliceHorizontal) {
        var _a = this.imageData, width = _a.width, height = _a.height;
        var _b = this, targetW = _b.targetW, targetH = _b.targetH;
        var context = this.targetCanvas.getContext('2d');
        var len = sliceVertical.length;
        var sx = sliceHorizontal.length ? sliceHorizontal[sliceHorizontal.length - 1] : width / 2;
        var sw = sliceHorizontal.length ? width - sliceHorizontal[sliceHorizontal.length - 1] : width / 2;
        var tx = sliceHorizontal.length ? targetW - sw : width / 2;
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
            sys.push(sliceVertical[i]);
            tys.push(sliceVertical[i] + ah * i);
            tys.push(sliceVertical[i] + ah * (i + 1));
        }
        for (var i = 0; i < len; i++) {
            var osx = sx;
            var osy = sys[i];
            var osw = sw;
            var osh = sys[i + 1] - sys[i];
            var oData = this.getData(osx, osy, osw, osh);
            context === null || context === void 0 ? void 0 : context.putImageData(oData, tx, tys[2 * i]);
            var ysx = sx;
            var ysy = sys[i + 1];
            var ysw = sw;
            var ysh = 1;
            var yData = this.getData(ysx, ysy, ysw, ysh);
            var yFragment = new ImageYFragment_1.default(ysx, ysy, yData, ah);
            context === null || context === void 0 ? void 0 : context.putImageData(yFragment.getData(), tx, tys[2 * i + 1]);
        }
    };
    ImageFactory.prototype.sliceBottom = function (sliceVertical, sliceHorizontal) {
        var _a = this.imageData, width = _a.width, height = _a.height;
        var _b = this, targetW = _b.targetW, targetH = _b.targetH;
        var context = this.targetCanvas.getContext('2d');
        var len = sliceHorizontal.length;
        var sy = sliceVertical.length ? sliceVertical[sliceVertical.length - 1] : height / 2;
        var sh = sliceVertical.length ? height - sliceVertical[sliceVertical.length - 1] : height / 2;
        var ty = sliceVertical.length ? targetH - sh : height / 2;
        if (len === 0) {
            var sx = width / 2;
            var sw = width / 2;
            var dataSource = this.getData(sx, sy, sw, sh);
            context === null || context === void 0 ? void 0 : context.putImageData(dataSource, sx, targetH - sh);
            return;
        }
        var aw = Math.floor((targetW - width) / len);
        var sxs = [];
        var txs = [];
        for (var i = 0; i < len; i++) {
            sxs.push(sliceHorizontal[i]);
            txs.push(sliceHorizontal[i] + aw * i);
            txs.push(sliceHorizontal[i] + aw * (i + 1));
        }
        for (var i = 0; i < len; i++) {
            var xsx = sxs[i];
            var xsy = sy;
            var xsw = 1;
            var xsh = sh;
            var xData = this.getData(xsx, xsy, xsw, xsh);
            var xFragment = new ImageXFragment_1.default(xsx, xsy, xData, aw);
            context === null || context === void 0 ? void 0 : context.putImageData(xFragment.getData(), txs[2 * i], ty);
            var osx = sxs[i];
            var osy = sy;
            var osw = sxs[i + 1] ? sxs[i + 1] - sxs[i] : width - sxs[i];
            var osh = sh;
            var oData = this.getData(osx, osy, osw, osh);
            context === null || context === void 0 ? void 0 : context.putImageData(oData, txs[2 * i + 1], ty);
        }
    };
    ImageFactory.prototype.sliceLeft = function (sliceVertical, sliceHorizontal) {
        var _a = this.imageData, width = _a.width, height = _a.height;
        var _b = this, targetW = _b.targetW, targetH = _b.targetH;
        var context = this.targetCanvas.getContext('2d');
        var len = sliceVertical.length;
        var sx = 0;
        var sw = sliceHorizontal.length ? width - sliceHorizontal[sliceHorizontal.length - 1] : width / 2;
        if (len === 0) {
            var sy = height / 2;
            var sh = height / 2;
            var dataSource = this.getData(sx, sy, sw, sh);
            context === null || context === void 0 ? void 0 : context.putImageData(dataSource, sx, sy);
            return;
        }
        var ah = Math.floor((targetH - height) / len);
        var sys = [];
        var tys = [];
        for (var i = 0; i < len; i++) {
            sys.push(sliceVertical[i]);
            tys.push(sliceVertical[i] + ah * i);
            tys.push(sliceVertical[i] + ah * (i + 1));
        }
        for (var i = 0; i < len; i++) {
            var ysx = sx;
            var ysy = sys[i];
            var ysw = sw;
            var ysh = 1;
            var yData = this.getData(ysx, ysy, ysw, ysh);
            var yFragment = new ImageYFragment_1.default(ysx, ysy, yData, ah);
            context === null || context === void 0 ? void 0 : context.putImageData(yFragment.getData(), ysx, tys[2 * i]);
            var osx = sx;
            var osy = sys[i];
            var osw = sw;
            var osh = sys[i + 1] ? sys[i + 1] - sys[i] : height - sys[i];
            var oData = this.getData(osx, osy, osw, osh);
            context === null || context === void 0 ? void 0 : context.putImageData(oData, osx, tys[2 * i + 1]);
        }
    };
    ImageFactory.prototype.sliceCenter = function () {
    };
    return ImageFactory;
}());
exports.default = ImageFactory;
