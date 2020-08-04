"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Descripttion: 将图片分割处理,按照上-右-下-左的顺序分割图片边框
 *  ===上===||
 *  ||      右
 *  左      ||
 *  ||===下===
 * @Date: 2020-07-27 09:18:19
 */
var ImageXFragment_1 = __importDefault(require("../fragment/ImageXFragment"));
var ImageYFragment_1 = __importDefault(require("../fragment/ImageYFragment"));
var ImageFillFragment_1 = __importDefault(require("../fragment/ImageFillFragment"));
var ImageFactory = /** @class */ (function () {
    /**
     * @param imageData:下载的图片数据
     * @param targetW: 最终图片的宽度
     * @param targetH: 最终图片的高度
     */
    function ImageFactory(imageData, targetW, targetH) {
        this.imageData = imageData;
        this.targetW = targetW;
        this.targetH = targetH;
        this.targetCanvas = document.createElement('canvas');
        this.targetCanvas.width = targetW;
        this.targetCanvas.height = targetH;
        this.sourceCanvas = document.createElement('canvas');
        this.sourceCanvas.width = imageData.width;
        this.sourceCanvas.height = imageData.height;
        var sourceContext = this.sourceCanvas.getContext('2d');
        sourceContext === null || sourceContext === void 0 ? void 0 : sourceContext.putImageData(imageData, 0, 0);
    }
    /**
     * 根据指定的xy坐标以及宽高,得到对应的图片数据
     * @param sx 原始数据x坐标
     * @param sy 原始数据y坐标
     * @param sw 图片数据的宽度
     * @param sh 图片数据的高度
     * @return: 截取的图片数据
     */
    ImageFactory.prototype.getData = function (sx, sy, sw, sh) {
        var _a;
        return ((_a = this.sourceCanvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.getImageData(sx, sy, sw, sh)) || new ImageData(0, 0);
    };
    /**
     * 根据水平与垂直分割坐标,分割图片,然后经过拉伸生成最终的背景图片
     * @param sliceVertical 水平方向上分割的坐标数组
     * @param sliceHorizontal 垂直方向上分割的坐标数组
     */
    ImageFactory.prototype.createImage = function (sliceHorizontal, sliceVertical) {
        this.slice(sliceHorizontal, sliceVertical);
        var image = this.merge();
        return image;
    };
    /**
     * 分割图片数据
     * @param sliceHorizontal 水平方向上分割的数组
     * @param sliceVertical 垂直方向上分割的数组
     */
    ImageFactory.prototype.slice = function (sliceHorizontal, sliceVertical) {
        var _a = this.imageData, sourceW = _a.width, sourceH = _a.height;
        var _b = this, targetW = _b.targetW, targetH = _b.targetH;
        if (!sliceHorizontal || sliceHorizontal.length === 0) {
            sliceHorizontal = [Math.floor(sourceW / 2)];
        }
        if (!sliceVertical || sliceVertical.length === 0) {
            sliceVertical = [Math.floor(sourceH / 2)];
        }
        if (targetW < sourceW || targetH < sourceH || (targetW === sourceW && targetH === sourceH)) {
            //不需要拉伸
            sliceHorizontal = [];
            sliceVertical = [];
        }
        else if (targetW > sourceW && targetH === sourceH) {
            //只拉伸X轴
            sliceVertical = [];
        }
        else if (targetW === sourceW && targetH > sourceH) {
            //只拉伸Y轴
            sliceHorizontal = [];
        }
        this.sliceTop(sliceHorizontal, sliceVertical);
        this.sliceRight(sliceHorizontal, sliceVertical);
        this.sliceBottom(sliceHorizontal, sliceVertical);
        this.sliceLeft(sliceHorizontal, sliceVertical);
        this.sliceCenter(sliceHorizontal, sliceVertical);
    };
    /**
     * 合并图片数据
     */
    ImageFactory.prototype.merge = function () {
        return this.targetCanvas.toDataURL();
    };
    /**
     * 处理上边框
     */
    ImageFactory.prototype.sliceTop = function (sliceHorizontal, sliceVertical) {
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
            var xFragment = new ImageXFragment_1.default(xsx, xsy, xData, aw);
            context === null || context === void 0 ? void 0 : context.putImageData(xFragment.getData(), txs[2 * i + 1], xsy);
        }
    };
    /**
     * 处理右边框
     */
    ImageFactory.prototype.sliceRight = function (sliceHorizontal, sliceVertical) {
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
            //原数据
            var osx = sx;
            var osy = sys[i];
            var osw = sw;
            var osh = sys[i + 1] - sys[i];
            var oData = this.getData(osx, osy, osw, osh);
            context === null || context === void 0 ? void 0 : context.putImageData(oData, tx, tys[2 * i]);
            //沿Y轴拉伸的数据
            var ysx = sx;
            var ysy = sys[i + 1];
            var ysw = sw;
            var ysh = 1;
            var yData = this.getData(ysx, ysy, ysw, ysh);
            var yFragment = new ImageYFragment_1.default(ysx, ysy, yData, ah);
            context === null || context === void 0 ? void 0 : context.putImageData(yFragment.getData(), tx, tys[2 * i + 1]);
        }
    };
    /**
     * 处理下边框
     */
    ImageFactory.prototype.sliceBottom = function (sliceHorizontal, sliceVertical) {
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
            //沿X轴拉伸的数据
            var xsx = sxs[i];
            var xsy = sy;
            var xsw = 1;
            var xsh = sh;
            var xData = this.getData(xsx, xsy, xsw, xsh);
            var xFragment = new ImageXFragment_1.default(xsx, xsy, xData, aw);
            context === null || context === void 0 ? void 0 : context.putImageData(xFragment.getData(), txs[2 * i], ty);
            //原数据
            var osx = sxs[i];
            var osy = sy;
            var osw = sxs[i + 1] ? sxs[i + 1] - sxs[i] : width - sxs[i];
            var osh = sh;
            var oData = this.getData(osx, osy, osw, osh);
            context === null || context === void 0 ? void 0 : context.putImageData(oData, txs[2 * i + 1], ty);
        }
    };
    /**
     * 处理左边框
     */
    ImageFactory.prototype.sliceLeft = function (sliceHorizontal, sliceVertical) {
        var _a = this.imageData, width = _a.width, height = _a.height;
        var targetH = this.targetH;
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
            //沿Y轴拉伸的数据
            var ysx = sx;
            var ysy = sys[i];
            var ysw = sw;
            var ysh = 1;
            var yData = this.getData(ysx, ysy, ysw, ysh);
            var yFragment = new ImageYFragment_1.default(ysx, ysy, yData, ah);
            context === null || context === void 0 ? void 0 : context.putImageData(yFragment.getData(), ysx, tys[2 * i]);
            //原数据
            var osx = sx;
            var osy = sys[i];
            var osw = sw;
            var osh = sys[i + 1] ? sys[i + 1] - sys[i] : height - sys[i];
            var oData = this.getData(osx, osy, osw, osh);
            context === null || context === void 0 ? void 0 : context.putImageData(oData, osx, tys[2 * i + 1]);
        }
    };
    /**
     * 处理中间区域
     */
    ImageFactory.prototype.sliceCenter = function (sliceHorizontal, sliceVertical) {
        if (!sliceHorizontal.length || !sliceVertical.length) {
            return;
        }
        var context = this.targetCanvas.getContext('2d');
        var _a = this.imageData, width = _a.width, height = _a.height;
        var _b = this, targetW = _b.targetW, targetH = _b.targetH;
        var hLen = sliceHorizontal.length;
        var vLen = sliceVertical.length;
        var aw = Math.floor((targetW - width) / hLen);
        var ah = Math.floor((targetH - height) / vLen);
        //水平方向上片段宽度
        var htws = [aw];
        for (var i = 0; i < hLen - 1; i++) {
            htws.push(sliceHorizontal[i + 1] - sliceHorizontal[i]);
            htws.push(aw);
        }
        //垂直方向上片段高度
        var vths = [ah];
        for (var i = 0; i < vLen - 1; i++) {
            vths.push(sliceVertical[i + 1] - sliceVertical[i]);
            vths.push(ah);
        }
        var ty = sliceVertical[0];
        for (var i = 0; i < vths.length; i++) {
            var tx = sliceHorizontal[0];
            for (var j = 0; j < htws.length; j++) {
                //0B01 0B00 j为偶数时,水平方向需要拉伸
                var hFlag = j % 2 === 0 ? 1 : 0;
                //0B10 0B00 i为偶数时,垂直方向需要拉伸
                var vFlag = i % 2 === 0 ? 2 : 0;
                //0B11:水平垂直拉伸; 0B10:垂直方向拉伸; 0B01:水平方向拉伸; 0B00:不拉伸
                var flag = hFlag ^ vFlag;
                var sx = sliceHorizontal[Math.ceil(j / 2)];
                var sy = sliceVertical[Math.ceil(i / 2)];
                var fragment = void 0;
                var dataSource = void 0;
                if (flag === FillFlag.HV) {
                    dataSource = this.getData(sx, sy, 1, 1);
                    dataSource && (fragment = new ImageFillFragment_1.default(sx, sy, dataSource, aw, ah));
                }
                else if (flag === FillFlag.V) {
                    dataSource = context === null || context === void 0 ? void 0 : context.getImageData(sx, sy, aw, 1);
                    dataSource && (fragment = new ImageYFragment_1.default(sx, sy, dataSource, ah));
                }
                else if (flag === FillFlag.H) {
                    dataSource = context === null || context === void 0 ? void 0 : context.getImageData(sx, sy, 1, ah);
                    dataSource && (fragment = new ImageXFragment_1.default(sx, sy, dataSource, aw));
                }
                else {
                    var hIndex = Math.ceil(j / 2);
                    var sw = sliceHorizontal[hIndex + 1] ?
                        sliceHorizontal[hIndex + 1] - sliceHorizontal[hIndex] : width - sliceHorizontal[hIndex];
                    var vIndex = Math.ceil(i / 2);
                    var sh = sliceVertical[vIndex + 1] ?
                        sliceVertical[vIndex + 1] - sliceVertical[vIndex] : width - sliceVertical[vIndex];
                    dataSource = context === null || context === void 0 ? void 0 : context.getImageData(sx, sy, sw, sh);
                }
                fragment && (dataSource = fragment.getData());
                if (dataSource) {
                    context === null || context === void 0 ? void 0 : context.putImageData(dataSource, tx, ty);
                }
                tx += htws[j];
            }
            ty += vths[i];
        }
    };
    return ImageFactory;
}());
/**
 * @field HV:水平,垂直方向拉伸标识
 * @field V:垂直方向拉伸标识
 * @field H:水平方向拉伸标识
 * @field O:无拉伸标识
 */
var FillFlag;
(function (FillFlag) {
    FillFlag[FillFlag["HV"] = 3] = "HV";
    FillFlag[FillFlag["V"] = 2] = "V";
    FillFlag[FillFlag["H"] = 1] = "H";
    FillFlag[FillFlag["O"] = 0] = "O";
})(FillFlag || (FillFlag = {}));
var Filter;
(function (Filter) {
    Filter[Filter["A"] = 0] = "A";
    Filter[Filter["B"] = 1] = "B";
    Filter[Filter["C"] = 2] = "C";
    Filter[Filter["D"] = 3] = "D";
})(Filter || (Filter = {}));
exports.default = ImageFactory;
