"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * 将图片分割处理,按照上-右-下-左的顺序分割图片边框
 *  ===上===||
 *  ||      右
 *  左      ||
 *  ||===下===
 */
var ImageXFragment_1 = __importDefault(require("../fragment/ImageXFragment"));
var ImageYFragment_1 = __importDefault(require("../fragment/ImageYFragment"));
var ImageXYFragment_1 = __importDefault(require("../fragment/ImageXYFragment"));
var ImageFragment_1 = __importDefault(require("../fragment/ImageFragment"));
var ImageFactory = /** @class */ (function () {
    /**
     * @param imageData:下载的图片数据
     * @param targetW: 最终图片的宽度
     * @param targetH: 最终图片的高度
     */
    function ImageFactory(imageData, targetW, targetH) {
        var ratio = window.devicePixelRatio || 1;
        this.sourceW = imageData.width;
        this.sourceH = imageData.height;
        this.targetW = targetW;
        this.targetH = targetH;
        this.targetCanvas = document.createElement('canvas');
        this.targetCanvas.width = targetW;
        this.targetCanvas.height = targetH;
        this.targetContext = this.targetCanvas.getContext('2d');
        var sourceCanvas = document.createElement('canvas');
        sourceCanvas.width = imageData.width;
        sourceCanvas.height = imageData.height;
        this.sourceContext = sourceCanvas.getContext('2d');
        this.sourceContext.putImageData(imageData, 0, 0);
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
        return this.sourceContext.getImageData(sx, sy, sw, sh);
    };
    /**
     * 根据水平与垂直分割坐标,分割图片,然后经过拉伸生成最终的背景图片
     * @param sliceVertical 水平方向上分割的坐标数组
     * @param sliceHorizontal 垂直方向上分割的坐标数组
     * @return: 图片数据
     */
    ImageFactory.prototype.createImage = function (sliceHorizontal, sliceVertical) {
        this.slice(sliceHorizontal, sliceVertical);
        return this.targetCanvas.toDataURL();
    };
    /**
     * 分割图片数据
     * @param sliceHorizontal 水平方向上分割的数组
     * @param sliceVertical 垂直方向上分割的数组
     */
    ImageFactory.prototype.slice = function (sliceHorizontal, sliceVertical) {
        var _a = this, sourceW = _a.sourceW, sourceH = _a.sourceH, targetW = _a.targetW, targetH = _a.targetH;
        if (!sliceHorizontal || sliceHorizontal.length === 0) {
            sliceHorizontal = [Math.ceil(sourceW / 2)];
        }
        if (!sliceVertical || sliceVertical.length === 0) {
            sliceVertical = [Math.ceil(sourceH / 2)];
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
     * 处理上边框 原始数据-拉伸数据...-原始数据-拉伸数据
     */
    ImageFactory.prototype.sliceTop = function (sliceHorizontal, sliceVertical) {
        var _a = this, sourceW = _a.sourceW, sourceH = _a.sourceH, targetW = _a.targetW, targetContext = _a.targetContext;
        var len = sliceHorizontal.length;
        var sy = 0;
        var sh = sliceVertical.length ? sliceVertical[0] : sourceH / 2;
        if (len === 0) {
            var sx = 0;
            var sw = sourceW / 2;
            var sourceData = this.getData(sx, sy, sw, sh);
            targetContext.putImageData(sourceData, sx, sy);
            return;
        }
        var aw = Math.ceil((targetW - sourceW) / len);
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
            targetContext.putImageData(oData, txs[2 * i], osy);
            //沿X轴拉伸的数据
            var xsx = sxs[i + 1];
            var xsy = sy;
            var xsw = 1;
            var xsh = sh;
            var xData = this.getData(xsx, xsy, xsw, xsh);
            var xFragment = new ImageXFragment_1.default(xsx, xsy, xData, aw);
            targetContext.putImageData(xFragment.getData(), txs[2 * i + 1], xsy);
        }
    };
    /**
     * 处理右边框 原始数据-拉伸数据...-原始数据-拉伸数据
     */
    ImageFactory.prototype.sliceRight = function (sliceHorizontal, sliceVertical) {
        var _a = this, sourceW = _a.sourceW, sourceH = _a.sourceH, targetW = _a.targetW, targetH = _a.targetH, targetContext = _a.targetContext;
        var len = sliceVertical.length;
        var sx = sliceHorizontal.length ? sliceHorizontal[sliceHorizontal.length - 1] : sourceW / 2;
        var sw = sliceHorizontal.length ? sourceW - sliceHorizontal[sliceHorizontal.length - 1] : sourceW / 2;
        var tx = sliceHorizontal.length ? targetW - sw : sourceW / 2;
        if (len === 0) {
            var sy = 0;
            var sh = sourceH / 2;
            var sourceData = this.getData(sx, sy, sw, sh);
            targetContext.putImageData(sourceData, targetW - sw, sy);
            return;
        }
        var ah = Math.ceil((targetH - sourceH) / len);
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
            targetContext.putImageData(oData, tx, tys[2 * i]);
            //沿Y轴拉伸的数据
            var ysx = sx;
            var ysy = sys[i + 1];
            var ysw = sw;
            var ysh = 1;
            var yData = this.getData(ysx, ysy, ysw, ysh);
            var yFragment = new ImageYFragment_1.default(ysx, ysy, yData, ah);
            targetContext.putImageData(yFragment.getData(), tx, tys[2 * i + 1]);
        }
    };
    /**
     * 处理下边框 拉伸数据-原始数据...-拉伸数据-原始数据
     */
    ImageFactory.prototype.sliceBottom = function (sliceHorizontal, sliceVertical) {
        var _a = this, sourceW = _a.sourceW, sourceH = _a.sourceH, targetW = _a.targetW, targetH = _a.targetH, targetContext = _a.targetContext;
        var len = sliceHorizontal.length;
        var sy = sliceVertical.length ? sliceVertical[sliceVertical.length - 1] : sourceH / 2;
        var sh = sliceVertical.length ? sourceH - sliceVertical[sliceVertical.length - 1] : sourceH / 2;
        var ty = sliceVertical.length ? targetH - sh : sourceH / 2;
        if (len === 0) {
            var sx = sourceW / 2;
            var sw = sourceW / 2;
            var sourceData = this.getData(sx, sy, sw, sh);
            targetContext.putImageData(sourceData, sx, targetH - sh);
            return;
        }
        var aw = Math.ceil((targetW - sourceW) / len);
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
            targetContext.putImageData(xFragment.getData(), txs[2 * i], ty);
            //原数据
            var osx = sxs[i];
            var osy = sy;
            var osw = sxs[i + 1] ? sxs[i + 1] - sxs[i] : sourceW - sxs[i];
            var osh = sh;
            var oData = this.getData(osx, osy, osw, osh);
            targetContext.putImageData(oData, txs[2 * i + 1], ty);
        }
    };
    /**
     * 处理左边框 拉伸数据-原始数据...-拉伸数据-原始数据
     */
    ImageFactory.prototype.sliceLeft = function (sliceHorizontal, sliceVertical) {
        var _a = this, sourceW = _a.sourceW, sourceH = _a.sourceH, targetH = _a.targetH, targetContext = _a.targetContext;
        var len = sliceVertical.length;
        var sx = 0;
        var sw = sliceHorizontal.length ? sourceW - sliceHorizontal[sliceHorizontal.length - 1] : sourceW / 2;
        if (len === 0) {
            var sy = sourceH / 2;
            var sh = sourceH / 2;
            var sourceData = this.getData(sx, sy, sw, sh);
            targetContext.putImageData(sourceData, sx, sy);
            return;
        }
        var ah = Math.ceil((targetH - sourceH) / len);
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
            targetContext.putImageData(yFragment.getData(), ysx, tys[2 * i]);
            //原数据
            var osx = sx;
            var osy = sys[i];
            var osw = sw;
            var osh = sys[i + 1] ? sys[i + 1] - sys[i] : sourceH - sys[i];
            var oData = this.getData(osx, osy, osw, osh);
            targetContext.putImageData(oData, osx, tys[2 * i + 1]);
        }
    };
    /**
     * 处理中间区域
     * XY拉伸 - Y拉伸 - XY拉伸... - Y拉伸 - XY拉伸
     *  |        |       |         |       |
     * X拉伸  - 原始  - X拉伸...  - 原始  - X拉伸
     *  |        |       |         |       |
     * XY拉伸 - Y拉伸 - XY拉伸... - Y拉伸 - XY拉伸
     * ...      ...     ...       ...     ...
     *  |        |       |         |       |
     * X拉伸  - 原始  - X拉伸...  - 原始  - X拉伸
     *  |        |       |         |       |
     * XY拉伸 - Y拉伸 - XY拉伸... - Y拉伸 - XY拉伸
     */
    ImageFactory.prototype.sliceCenter = function (sliceHorizontal, sliceVertical) {
        if (!sliceHorizontal.length || !sliceVertical.length) {
            return;
        }
        var _a = this, sourceW = _a.sourceW, sourceH = _a.sourceH, targetW = _a.targetW, targetH = _a.targetH, targetContext = _a.targetContext;
        var hLen = sliceHorizontal.length;
        var vLen = sliceVertical.length;
        var aw = Math.ceil((targetW - sourceW) / hLen);
        var ah = Math.ceil((targetH - sourceH) / vLen);
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
                var sx = sliceHorizontal[Math.floor(j / 2)];
                var sy = sliceVertical[Math.floor(i / 2)];
                var fragment = void 0;
                var sourceData = void 0;
                switch (flag) {
                    case FillFlag.HV:
                        sourceData = this.getData(sx, sy, 1, 1);
                        fragment = new ImageXYFragment_1.default(sx, sy, sourceData, aw, ah);
                        targetContext.putImageData(fragment.getData(), tx, ty);
                        break;
                    case FillFlag.V:
                        sourceData = this.getData(sx, sy, htws[j], 1);
                        fragment = new ImageYFragment_1.default(sx, sy, sourceData, ah);
                        targetContext.putImageData(fragment.getData(), tx, ty);
                        break;
                    case FillFlag.H:
                        sourceData = this.getData(sx, sy, 1, vths[i]);
                        fragment = new ImageXFragment_1.default(sx, sy, sourceData, aw);
                        targetContext.putImageData(fragment.getData(), tx, ty);
                        break;
                    case FillFlag.O:
                        var hIndex = Math.floor(j / 2);
                        var vIndex = Math.floor(i / 2);
                        var sw = sliceHorizontal[hIndex + 1] - sliceHorizontal[hIndex];
                        var sh = sliceVertical[vIndex + 1] - sliceVertical[vIndex];
                        sourceData = this.getData(sx, sy, sw, sh);
                        fragment = new ImageFragment_1.default(sx, sy, sourceData);
                        targetContext.putImageData(fragment.getData(), tx, ty);
                        break;
                    default:
                        break;
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
exports.default = ImageFactory;
