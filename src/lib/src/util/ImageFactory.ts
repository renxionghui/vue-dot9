/*
 * @Descripttion: 将图片分割处理,按照上-右-下-左的顺序分割图片边框
 *  ===上===||
 *  ||      右
 *  左      ||
 *  ||===下===
 * @Date: 2020-07-27 09:18:19
 */
import ImageXFragment from '../fragment/ImageXFragment';
import ImageYFragment from '../fragment/ImageYFragment';
import ImageFillFragment from '../fragment/ImageFillFragment';
import { filter } from 'vue/types/umd';

class ImageFactory {
    imageData: ImageData;
    targetW: number;
    targetH: number;
    targetCanvas: HTMLCanvasElement;
    sourceCanvas: HTMLCanvasElement;

    /**
     * @param imageData:下载的图片数据
     * @param targetW: 最终图片的宽度
     * @param targetH: 最终图片的高度
     */
    constructor(imageData: ImageData, targetW: number, targetH: number) {
        this.imageData = imageData;
        this.targetW = targetW;
        this.targetH = targetH;
        this.targetCanvas = document.createElement('canvas');
        this.targetCanvas.width = targetW;
        this.targetCanvas.height = targetH;
        this.sourceCanvas = document.createElement('canvas');
        this.sourceCanvas.width = imageData.width;
        this.sourceCanvas.height = imageData.height;
        const sourceContext = this.sourceCanvas.getContext('2d');
        sourceContext?.putImageData(imageData, 0, 0);
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
        return this.sourceCanvas.getContext('2d')?.getImageData(sx, sy, sw, sh) || new ImageData(0, 0);
    }

    /**
     * 根据水平与垂直分割坐标,分割图片,然后经过拉伸生成最终的背景图片
     * @param sliceVertical 水平方向上分割的坐标数组
     * @param sliceHorizontal 垂直方向上分割的坐标数组
     */
    createImage(sliceHorizontal?: Array<number>, sliceVertical?: Array<number>) {
        this.slice(sliceHorizontal, sliceVertical);
        const image = this.merge();
        return image;
    }

    /**
     * 分割图片数据
     * @param sliceHorizontal 水平方向上分割的数组
     * @param sliceVertical 垂直方向上分割的数组
     */
    slice(sliceHorizontal?: Array<number>, sliceVertical?: Array<number>) {
        const { width: sourceW, height: sourceH } = this.imageData;
        const { targetW, targetH } = this;
        if (!sliceHorizontal || sliceHorizontal.length === 0) {
            sliceHorizontal = [Math.floor(sourceW / 2)]
        }
        if (!sliceVertical || sliceVertical.length === 0) {
            sliceVertical = [Math.floor(sourceH / 2)]
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
     * 合并图片数据
     */
    merge() {
        return this.targetCanvas.toDataURL();
    }

    /**
     * 处理上边框
     */
    sliceTop(sliceHorizontal: Array<number>, sliceVertical: Array<number>) {
        const { width, height } = this.imageData;
        const { targetW } = this;
        const context = this.targetCanvas.getContext('2d');

        const len = sliceHorizontal.length;
        const sy = 0;
        const sh = sliceVertical.length ? sliceVertical[0] : height / 2;
        if (len === 0) {
            const sx = 0;
            const sw = width / 2;
            const dataSource = this.getData(sx, sy, sw, sh)
            context?.putImageData(dataSource, sx, sy);
            return
        }

        const aw = Math.floor((targetW - width) / len);
        let sxs: Array<number> = [0];
        let txs: Array<number> = [0];
        for (let i = 0; i < len; i++) {
            sxs.push(sliceHorizontal[i])
            txs.push(sliceHorizontal[i] + aw * i);
            txs.push(sliceHorizontal[i] + aw * (i + 1));
        }
        for (let i = 0; i < len; i++) {
            //原数据
            const osx = sxs[i];
            const osy = sy;
            const osw = sxs[i + 1] - sxs[i];
            const osh = sh;
            const oData = this.getData(osx, osy, osw, osh);
            context?.putImageData(oData, txs[2 * i], osy)
            //沿X轴拉伸的数据
            const xsx = sxs[i + 1];
            const xsy = sy;
            const xsw = 1;
            const xsh = sh;
            const xData = this.getData(xsx, xsy, xsw, xsh);
            const xFragment = new ImageXFragment(xsx, xsy, xData, aw);
            context?.putImageData(xFragment.getData(), txs[2 * i + 1], xsy)
        }
    }

    /**
     * 处理右边框
     */
    sliceRight(sliceHorizontal: Array<number>, sliceVertical: Array<number>) {
        const { width, height } = this.imageData;
        const { targetW, targetH } = this;
        const context = this.targetCanvas.getContext('2d');

        const len = sliceVertical.length;
        const sx = sliceHorizontal.length ? sliceHorizontal[sliceHorizontal.length - 1] : width / 2;
        const sw = sliceHorizontal.length ? width - sliceHorizontal[sliceHorizontal.length - 1] : width / 2;
        const tx = sliceHorizontal.length ? targetW - sw : width / 2;
        if (len === 0) {
            const sy = 0;
            const sh = height / 2;
            const dataSource = this.getData(sx, sy, sw, sh)
            context?.putImageData(dataSource, targetW - sw, sy);
            return
        }
        const ah = Math.floor((targetH - height) / len);
        let sys: Array<number> = [0];
        let tys: Array<number> = [0];

        for (let i = 0; i < len; i++) {
            sys.push(sliceVertical[i])
            tys.push(sliceVertical[i] + ah * i);
            tys.push(sliceVertical[i] + ah * (i + 1));
        }


        for (let i = 0; i < len; i++) {
            //原数据
            const osx = sx;
            const osy = sys[i];
            const osw = sw;
            const osh = sys[i + 1] - sys[i];
            const oData = this.getData(osx, osy, osw, osh);
            context?.putImageData(oData, tx, tys[2 * i])
            //沿Y轴拉伸的数据
            const ysx = sx;
            const ysy = sys[i + 1];
            const ysw = sw;
            const ysh = 1;
            const yData = this.getData(ysx, ysy, ysw, ysh);
            const yFragment = new ImageYFragment(ysx, ysy, yData, ah);
            context?.putImageData(yFragment.getData(), tx, tys[2 * i + 1])
        }
    }

    /**
     * 处理下边框
     */
    sliceBottom(sliceHorizontal: Array<number>, sliceVertical: Array<number>) {
        const { width, height } = this.imageData;
        const { targetW, targetH } = this;
        const context = this.targetCanvas.getContext('2d');

        const len = sliceHorizontal.length;
        const sy = sliceVertical.length ? sliceVertical[sliceVertical.length - 1] : height / 2;
        const sh = sliceVertical.length ? height - sliceVertical[sliceVertical.length - 1] : height / 2;
        const ty = sliceVertical.length ? targetH - sh : height / 2;
        if (len === 0) {
            const sx = width / 2;
            const sw = width / 2;
            const dataSource = this.getData(sx, sy, sw, sh)
            context?.putImageData(dataSource, sx, targetH - sh);
            return
        }

        const aw = Math.floor((targetW - width) / len);
        const sxs: Array<number> = [];
        const txs: Array<number> = [];
        for (let i = 0; i < len; i++) {
            sxs.push(sliceHorizontal[i])
            txs.push(sliceHorizontal[i] + aw * i);
            txs.push(sliceHorizontal[i] + aw * (i + 1));
        }

        for (let i = 0; i < len; i++) {
            //沿X轴拉伸的数据
            const xsx = sxs[i];
            const xsy = sy;
            const xsw = 1;
            const xsh = sh;
            const xData = this.getData(xsx, xsy, xsw, xsh);
            const xFragment = new ImageXFragment(xsx, xsy, xData, aw);
            context?.putImageData(xFragment.getData(), txs[2 * i], ty)
            //原数据
            const osx = sxs[i];
            const osy = sy;
            const osw = sxs[i + 1] ? sxs[i + 1] - sxs[i] : width - sxs[i];
            const osh = sh;
            const oData = this.getData(osx, osy, osw, osh);
            context?.putImageData(oData, txs[2 * i + 1], ty)

        }
    }

    /**
     * 处理左边框
     */
    sliceLeft(sliceHorizontal: Array<number>, sliceVertical: Array<number>) {
        const { width, height } = this.imageData;
        const { targetH } = this;
        const context = this.targetCanvas.getContext('2d');

        const len = sliceVertical.length;
        const sx = 0;
        const sw = sliceHorizontal.length ? width - sliceHorizontal[sliceHorizontal.length - 1] : width / 2;
        if (len === 0) {
            const sy = height / 2;
            const sh = height / 2;
            const dataSource = this.getData(sx, sy, sw, sh)
            context?.putImageData(dataSource, sx, sy);
            return
        }
        const ah = Math.floor((targetH - height) / len);
        let sys: Array<number> = [];
        let tys: Array<number> = [];

        for (let i = 0; i < len; i++) {
            sys.push(sliceVertical[i])
            tys.push(sliceVertical[i] + ah * i);
            tys.push(sliceVertical[i] + ah * (i + 1));
        }

        for (let i = 0; i < len; i++) {
            //沿Y轴拉伸的数据
            const ysx = sx;
            const ysy = sys[i];
            const ysw = sw;
            const ysh = 1;
            const yData = this.getData(ysx, ysy, ysw, ysh);
            const yFragment = new ImageYFragment(ysx, ysy, yData, ah);
            context?.putImageData(yFragment.getData(), ysx, tys[2 * i])
            //原数据
            const osx = sx;
            const osy = sys[i];
            const osw = sw;
            const osh = sys[i + 1] ? sys[i + 1] - sys[i] : height - sys[i];
            const oData = this.getData(osx, osy, osw, osh);
            context?.putImageData(oData, osx, tys[2 * i + 1])
        }
    }

    /**
     * 处理中间区域
     */
    sliceCenter(sliceHorizontal: Array<number>, sliceVertical: Array<number>) {
        if (!sliceHorizontal.length || !sliceVertical.length) {
            return;
        }
        const context = this.targetCanvas.getContext('2d');
        const { width, height } = this.imageData;
        const { targetW, targetH } = this;
        const hLen = sliceHorizontal.length;
        const vLen = sliceVertical.length;
        const aw = Math.floor((targetW - width) / hLen);
        const ah = Math.floor((targetH - height) / vLen);
        //水平方向上片段宽度
        const htws = [aw];
        for (let i = 0; i < hLen - 1; i++) {
            htws.push(sliceHorizontal[i + 1] - sliceHorizontal[i]);
            htws.push(aw);
        }

        //垂直方向上片段高度
        const vths = [ah];
        for (let i = 0; i < vLen - 1; i++) {
            vths.push(sliceVertical[i + 1] - sliceVertical[i]);
            vths.push(ah);
        }

        let ty = sliceVertical[0];
        for (let i = 0; i < vths.length; i++) {
            let tx = sliceHorizontal[0];
            for (let j = 0; j < htws.length; j++) {
                //0B01 0B00 j为偶数时,水平方向需要拉伸
                const hFlag = j % 2 === 0 ? 1 : 0;
                //0B10 0B00 i为偶数时,垂直方向需要拉伸
                const vFlag = i % 2 === 0 ? 2 : 0;
                //0B11:水平垂直拉伸; 0B10:垂直方向拉伸; 0B01:水平方向拉伸; 0B00:不拉伸
                const flag = hFlag ^ vFlag;

                const sx = sliceHorizontal[Math.ceil(j / 2)];
                const sy = sliceVertical[Math.ceil(i / 2)];
                let fragment;
                let dataSource;
                if (flag === FillFlag.HV) {
                    dataSource = this.getData(sx, sy, 1, 1);
                    dataSource && (fragment = new ImageFillFragment(sx, sy, dataSource, aw, ah));
                } else if (flag === FillFlag.V) {
                    dataSource = context?.getImageData(sx, sy, aw, 1);
                    dataSource && (fragment = new ImageYFragment(sx, sy, dataSource, ah))
                } else if (flag === FillFlag.H) {
                    dataSource = context?.getImageData(sx, sy, 1, ah);
                    dataSource && (fragment = new ImageXFragment(sx, sy, dataSource, aw))
                } else {
                    const hIndex = Math.ceil(j / 2);
                    const sw = sliceHorizontal[hIndex + 1] ?
                        sliceHorizontal[hIndex + 1] - sliceHorizontal[hIndex] : width - sliceHorizontal[hIndex];
                    const vIndex = Math.ceil(i / 2);
                    const sh = sliceVertical[vIndex + 1] ?
                        sliceVertical[vIndex + 1] - sliceVertical[vIndex] : width - sliceVertical[vIndex];
                    dataSource = context?.getImageData(sx, sy, sw, sh)
                }
                fragment && (dataSource = fragment.getData());

                if (dataSource) {
                    context?.putImageData(dataSource, tx, ty);
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

enum Filter {
    A, B, C, D
}
export default ImageFactory;
