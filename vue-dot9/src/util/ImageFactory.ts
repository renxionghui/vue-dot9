/*
 * 将图片分割处理,按照上-右-下-左的顺序分割图片边框
 *  ===上===||
 *  ||      右
 *  左      ||
 *  ||===下===
 */
import ImageXFragment from '../fragment/ImageXFragment';
import ImageYFragment from '../fragment/ImageYFragment';
import ImageXYFragment from '../fragment/ImageXYFragment';
import ImageFragment from '../fragment/ImageFragment';

class ImageFactory {
    private sourceW: number;
    private sourceH: number;
    private targetW: number;
    private targetH: number;
    private targetCanvas: HTMLCanvasElement;
    private targetContext: CanvasRenderingContext2D;
    private sourceContext: CanvasRenderingContext2D;
    private ratio: number = window.devicePixelRatio || 1;
    /**
     * @param imageData:下载的图片数据
     * @param targetW: 最终图片的宽度
     * @param targetH: 最终图片的高度
     */
    constructor(imageData: ImageData, targetW: number, targetH: number) {
        

        this.sourceW = imageData.width;
        this.sourceH = imageData.height;
        this.targetW = targetW * this.ratio;
        this.targetH = targetH * this.ratio;

        this.targetCanvas = document.createElement('canvas');
        this.targetCanvas.width = targetW * this.ratio;
        this.targetCanvas.height = targetH * this.ratio;
        this.targetContext = <CanvasRenderingContext2D>this.targetCanvas.getContext('2d');
        const sourceCanvas: HTMLCanvasElement = document.createElement('canvas');
        sourceCanvas.width = imageData.width;
        sourceCanvas.height = imageData.height;
        this.sourceContext = <CanvasRenderingContext2D>sourceCanvas.getContext('2d');
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
    private getData(sx: number, sy: number, sw: number, sh: number): ImageData {
        return <ImageData>this.sourceContext.getImageData(sx, sy, sw, sh);
    }

    /**
     * 根据水平与垂直分割坐标,分割图片,然后经过拉伸生成最终的背景图片
     * @param sliceVertical 水平方向上分割的坐标数组
     * @param sliceHorizontal 垂直方向上分割的坐标数组
     * @return: 图片数据
     */
    public createImage(sliceHorizontal?: Array<number>, sliceVertical?: Array<number>): string {
        if (sliceHorizontal && sliceHorizontal.length > 0) {
            for (let i = 0; i < sliceHorizontal.length; i++) {
                sliceHorizontal[i] = sliceHorizontal[i] * this.ratio
            }
        }
        if (sliceVertical && sliceVertical.length > 0) {
            for (let i = 0; i < sliceVertical.length; i++) {
                sliceVertical[i] = sliceVertical[i] * this.ratio
            }
        }
        this.slice(sliceHorizontal, sliceVertical);
        return this.targetCanvas.toDataURL();
    }

    /**
     * 分割图片数据
     * @param sliceHorizontal 水平方向上分割的数组
     * @param sliceVertical 垂直方向上分割的数组
     */
    private slice(sliceHorizontal?: Array<number>, sliceVertical?: Array<number>) {
        const { sourceW, sourceH, targetW, targetH } = this;
        if (!sliceHorizontal || sliceHorizontal.length === 0) {
            sliceHorizontal = [Math.ceil(sourceW / 2)]
        }
        if (!sliceVertical || sliceVertical.length === 0) {
            sliceVertical = [Math.ceil(sourceH / 2)]
        }
        if (targetW < sourceW || targetH < sourceH || (targetW === sourceW && targetH === sourceH)) {
            //不需要拉伸
            sliceHorizontal = [];
            sliceVertical = [];
        } else if (targetW > sourceW && targetH === sourceH) {
            //只拉伸X轴
            sliceVertical = [];
        } else if (targetW === sourceW && targetH > sourceH) {
            //只拉伸Y轴
            sliceHorizontal = [];
        }

        this.sliceTop(sliceHorizontal, sliceVertical);
        this.sliceRight(sliceHorizontal, sliceVertical);
        this.sliceBottom(sliceHorizontal, sliceVertical);
        this.sliceLeft(sliceHorizontal, sliceVertical);
        this.sliceCenter(sliceHorizontal, sliceVertical);
    }

    /**
     * 处理上边框 原始数据-拉伸数据...-原始数据-拉伸数据
     */
    private sliceTop(sliceHorizontal: Array<number>, sliceVertical: Array<number>) {
        const { sourceW, sourceH, targetW, targetContext } = this;

        const len: number = sliceHorizontal.length;
        const sy: number = 0;
        const sh: number = sliceVertical.length ? sliceVertical[0] : sourceH / 2;
        if (len === 0) {
            const sx: number = 0;
            const sw: number = sourceW / 2;
            const sourceData: ImageData = this.getData(sx, sy, sw, sh)
            targetContext.putImageData(sourceData, sx, sy);
            return
        }

        const aw: number = Math.ceil((targetW - sourceW) / len);
        let sxs: Array<number> = [0];
        let txs: Array<number> = [0];
        for (let i = 0; i < len; i++) {
            sxs.push(sliceHorizontal[i])
            txs.push(sliceHorizontal[i] + aw * i);
            txs.push(sliceHorizontal[i] + aw * (i + 1));
        }
        for (let i = 0; i < len; i++) {
            //原数据
            const osx: number = sxs[i];
            const osy: number = sy;
            const osw: number = sxs[i + 1] - sxs[i];
            const osh: number = sh;
            const oData: ImageData = this.getData(osx, osy, osw, osh);
            targetContext.putImageData(oData, txs[2 * i], osy)
            //沿X轴拉伸的数据
            const xsx: number = sxs[i + 1];
            const xsy: number = sy;
            const xsw: number = 1;
            const xsh: number = sh;
            const xData: ImageData = this.getData(xsx, xsy, xsw, xsh);
            const xFragment: ImageXFragment = new ImageXFragment(xsx, xsy, xData, aw);
            targetContext.putImageData(xFragment.getData(), txs[2 * i + 1], xsy)
        }
    }

    /**
     * 处理右边框 原始数据-拉伸数据...-原始数据-拉伸数据
     */
    private sliceRight(sliceHorizontal: Array<number>, sliceVertical: Array<number>) {
        const { sourceW, sourceH, targetW, targetH, targetContext } = this;

        const len: number = sliceVertical.length;
        const sx: number = sliceHorizontal.length ? sliceHorizontal[sliceHorizontal.length - 1] : sourceW / 2;
        const sw: number = sliceHorizontal.length ? sourceW - sliceHorizontal[sliceHorizontal.length - 1] : sourceW / 2;
        const tx: number = sliceHorizontal.length ? targetW - sw : sourceW / 2;
        if (len === 0) {
            const sy: number = 0;
            const sh: number = sourceH / 2;
            const sourceData: ImageData = this.getData(sx, sy, sw, sh)
            targetContext.putImageData(sourceData, targetW - sw, sy);
            return
        }
        const ah: number = Math.ceil((targetH - sourceH) / len);
        let sys: Array<number> = [0];
        let tys: Array<number> = [0];

        for (let i = 0; i < len; i++) {
            sys.push(sliceVertical[i])
            tys.push(sliceVertical[i] + ah * i);
            tys.push(sliceVertical[i] + ah * (i + 1));
        }

        for (let i = 0; i < len; i++) {
            //原数据
            const osx: number = sx;
            const osy: number = sys[i];
            const osw: number = sw;
            const osh: number = sys[i + 1] - sys[i];
            const oData: ImageData = this.getData(osx, osy, osw, osh);
            targetContext.putImageData(oData, tx, tys[2 * i])
            //沿Y轴拉伸的数据
            const ysx: number = sx;
            const ysy: number = sys[i + 1];
            const ysw: number = sw;
            const ysh: number = 1;
            const yData: ImageData = this.getData(ysx, ysy, ysw, ysh);
            const yFragment: ImageYFragment = new ImageYFragment(ysx, ysy, yData, ah);
            targetContext.putImageData(yFragment.getData(), tx, tys[2 * i + 1])
        }
    }

    /**
     * 处理下边框 拉伸数据-原始数据...-拉伸数据-原始数据
     */
    private sliceBottom(sliceHorizontal: Array<number>, sliceVertical: Array<number>) {
        const { sourceW, sourceH, targetW, targetH, targetContext } = this;

        const len: number = sliceHorizontal.length;
        const sy: number = sliceVertical.length ? sliceVertical[sliceVertical.length - 1] : sourceH / 2;
        const sh: number = sliceVertical.length ? sourceH - sliceVertical[sliceVertical.length - 1] : sourceH / 2;
        const ty: number = sliceVertical.length ? targetH - sh : sourceH / 2;
        if (len === 0) {
            const sx: number = sourceW / 2;
            const sw: number = sourceW / 2;
            const sourceData: ImageData = this.getData(sx, sy, sw, sh)
            targetContext.putImageData(sourceData, sx, targetH - sh);
            return
        }

        const aw: number = Math.ceil((targetW - sourceW) / len);
        const sxs: Array<number> = [];
        const txs: Array<number> = [];
        for (let i = 0; i < len; i++) {
            sxs.push(sliceHorizontal[i])
            txs.push(sliceHorizontal[i] + aw * i);
            txs.push(sliceHorizontal[i] + aw * (i + 1));
        }

        for (let i = 0; i < len; i++) {
            //沿X轴拉伸的数据
            const xsx: number = sxs[i];
            const xsy: number = sy;
            const xsw: number = 1;
            const xsh: number = sh;
            const xData: ImageData = this.getData(xsx, xsy, xsw, xsh);
            const xFragment: ImageXFragment = new ImageXFragment(xsx, xsy, xData, aw);
            targetContext.putImageData(xFragment.getData(), txs[2 * i], ty)
            //原数据
            const osx: number = sxs[i];
            const osy: number = sy;
            const osw: number = sxs[i + 1] ? sxs[i + 1] - sxs[i] : sourceW - sxs[i];
            const osh: number = sh;
            const oData: ImageData = this.getData(osx, osy, osw, osh);
            targetContext.putImageData(oData, txs[2 * i + 1], ty)
        }
    }

    /**
     * 处理左边框 拉伸数据-原始数据...-拉伸数据-原始数据
     */
    private sliceLeft(sliceHorizontal: Array<number>, sliceVertical: Array<number>) {
        const { sourceW, sourceH, targetH, targetContext } = this;

        const len: number = sliceVertical.length;
        const sx: number = 0;
        const sw: number = sliceHorizontal.length ? sourceW - sliceHorizontal[sliceHorizontal.length - 1] : sourceW / 2;
        if (len === 0) {
            const sy: number = sourceH / 2;
            const sh: number = sourceH / 2;
            const sourceData: ImageData = this.getData(sx, sy, sw, sh)
            targetContext.putImageData(sourceData, sx, sy);
            return
        }

        const ah: number = Math.ceil((targetH - sourceH) / len);
        let sys: Array<number> = [];
        let tys: Array<number> = [];

        for (let i = 0; i < len; i++) {
            sys.push(sliceVertical[i])
            tys.push(sliceVertical[i] + ah * i);
            tys.push(sliceVertical[i] + ah * (i + 1));
        }

        for (let i = 0; i < len; i++) {
            //沿Y轴拉伸的数据
            const ysx: number = sx;
            const ysy: number = sys[i];
            const ysw: number = sw;
            const ysh: number = 1;
            const yData: ImageData = this.getData(ysx, ysy, ysw, ysh);
            const yFragment: ImageYFragment = new ImageYFragment(ysx, ysy, yData, ah);
            targetContext.putImageData(yFragment.getData(), ysx, tys[2 * i])
            //原数据
            const osx: number = sx;
            const osy: number = sys[i];
            const osw: number = sw;
            const osh: number = sys[i + 1] ? sys[i + 1] - sys[i] : sourceH - sys[i];
            const oData: ImageData = this.getData(osx, osy, osw, osh);
            targetContext.putImageData(oData, osx, tys[2 * i + 1])
        }
    }

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
    private sliceCenter(sliceHorizontal: Array<number>, sliceVertical: Array<number>) {
        if (!sliceHorizontal.length || !sliceVertical.length) {
            return;
        }

        const { sourceW, sourceH, targetW, targetH, targetContext } = this;
        const hLen: number = sliceHorizontal.length;
        const vLen: number = sliceVertical.length;
        const aw: number = Math.ceil((targetW - sourceW) / hLen);
        const ah: number = Math.ceil((targetH - sourceH) / vLen);
        //水平方向上片段宽度
        const htws: Array<number> = [aw];
        for (let i = 0; i < hLen - 1; i++) {
            htws.push(sliceHorizontal[i + 1] - sliceHorizontal[i]);
            htws.push(aw);
        }

        //垂直方向上片段高度
        const vths: Array<number> = [ah];
        for (let i = 0; i < vLen - 1; i++) {
            vths.push(sliceVertical[i + 1] - sliceVertical[i]);
            vths.push(ah);
        }
        let ty: number = sliceVertical[0];
        for (let i = 0; i < vths.length; i++) {
            let tx: number = sliceHorizontal[0];
            for (let j = 0; j < htws.length; j++) {
                //0B01 0B00 j为偶数时,水平方向需要拉伸
                const hFlag: number = j % 2 === 0 ? 1 : 0;
                //0B10 0B00 i为偶数时,垂直方向需要拉伸
                const vFlag: number = i % 2 === 0 ? 2 : 0;
                //0B11:水平垂直拉伸; 0B10:垂直方向拉伸; 0B01:水平方向拉伸; 0B00:不拉伸
                const flag: number = hFlag ^ vFlag;

                const sx: number = sliceHorizontal[Math.floor(j / 2)];
                const sy: number = sliceVertical[Math.floor(i / 2)];

                let fragment: ImageFragment;
                let sourceData: ImageData;

                switch (flag) {
                    case FillFlag.HV:
                        sourceData = this.getData(sx, sy, 1, 1);
                        fragment = new ImageXYFragment(sx, sy, sourceData, aw, ah);
                        targetContext.putImageData(fragment.getData(), tx, ty);
                        break;
                    case FillFlag.V:
                        sourceData = this.getData(sx, sy, htws[j], 1);
                        fragment = new ImageYFragment(sx, sy, sourceData, ah)
                        targetContext.putImageData(fragment.getData(), tx, ty);
                        break;
                    case FillFlag.H:
                        sourceData = this.getData(sx, sy, 1, vths[i]);
                        fragment = new ImageXFragment(sx, sy, sourceData, aw)
                        targetContext.putImageData(fragment.getData(), tx, ty);
                        break;
                    case FillFlag.O:
                        const hIndex: number = Math.floor(j / 2);
                        const vIndex: number = Math.floor(i / 2);
                        const sw: number = sliceHorizontal[hIndex + 1] - sliceHorizontal[hIndex];
                        const sh: number = sliceVertical[vIndex + 1] - sliceVertical[vIndex];
                        sourceData = this.getData(sx, sy, sw, sh);
                        fragment = new ImageFragment(sx, sy, sourceData);
                        targetContext.putImageData(fragment.getData(), tx, ty);
                        break;
                    default:
                        break;
                }
                tx += htws[j];
            }
            ty += vths[i];

        }
    }
}

/**
 * @field HV:水平,垂直方向拉伸标识
 * @field V:垂直方向拉伸标识
 * @field H:水平方向拉伸标识
 * @field O:无拉伸标识
 */
enum FillFlag {
    HV = 3,
    V = 2,
    H = 1,
    O = 0
}

export default ImageFactory;
