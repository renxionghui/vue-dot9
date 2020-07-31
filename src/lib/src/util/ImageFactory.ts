/*
 * @Descripttion: 将图片分割处理
 * @Date: 2020-07-27 09:18:19
 */
import ImageXFragment from '../fragment/ImageXFragment';
import ImageYFragment from '../fragment/ImageYFragment';
// import ImageXYFragment from '../fragment/ImageXYFragment';
import ImageFragment from '../fragment/ImageFragment';
class ImageFactory {
    imageData: ImageData;
    imageFragments: Array<ImageFragment> = [];
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
        this.sourceCanvas.getContext('2d')?.putImageData(imageData, 0, 0);
    }

    private getData(sx: number, sy: number, sw: number, sh: number): ImageData {
        return this.sourceCanvas.getContext('2d')?.getImageData(sx, sy, sw, sh) || new ImageData(0, 0);
    }

    createImage(sliceVertical?: Array<number>, sliceHorizontal?: Array<number>) {
        this.slice(sliceVertical, sliceHorizontal);
        const image = this.merge();
        return image;
    }

    /**
     * 分割图片数据
     */
    slice(sliceVertical?: Array<number>, sliceHorizontal?: Array<number>) {
        const { width: sourceW, height: sourceH } = this.imageData;
        const { targetW, targetH } = this;
        if (!sliceVertical || sliceVertical.length === 0) {
            sliceVertical = [Math.floor(sourceW / 2)]
        }
        if (!sliceHorizontal || sliceHorizontal.length === 0) {
            sliceHorizontal = [Math.floor(sourceH / 2)]
        }
        if (targetW < sourceW || targetH < sourceH || (targetW === sourceW && targetH === sourceH)) {
            this.imageFragments.push(new ImageFragment(0, 0, this.imageData))
        } else if (targetW > sourceW && targetH === sourceH) {//只拉伸X轴
            sliceHorizontal = [];
        } else if (targetW === sourceW && targetH > sourceH) {
            // this.createYFragments(sliceHorizontal)
            sliceVertical = [];
        } else {
            // sliceVertical = [];
            // this.createXYFragment(sliceVertical, sliceHorizontal);
        }

        this.sliceTop(sliceVertical, sliceHorizontal);
        this.sliceRight(sliceVertical, sliceHorizontal);
        this.sliceBottom(sliceVertical,sliceHorizontal);
    }

    /**
     * 合并图片数据
     */
    merge() {

        return this.targetCanvas.toDataURL();
    }

    sliceTop(sliceVertical: Array<number>, sliceHorizontal: Array<number>) {
        const { width, height } = this.imageData;
        const { targetW } = this;
        const context = this.targetCanvas.getContext('2d');

        const len = sliceVertical.length;
        const sy = 0;
        const sh = sliceHorizontal.length ? sliceHorizontal[0] : height / 2;
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
            sxs.push(sliceVertical[i])
            txs.push(sliceVertical[i] + aw * i);
            txs.push(sliceVertical[i] + aw * (i + 1));
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

    sliceRight(sliceVertical: Array<number>, sliceHorizontal: Array<number>) {
        const { width, height } = this.imageData;
        const { targetW, targetH } = this;
        const context = this.targetCanvas.getContext('2d');

        const len = sliceHorizontal.length;
        const sx = sliceVertical.length ? sliceVertical[sliceVertical.length - 1] : width / 2;
        const sw = sliceVertical.length ? width - sliceVertical[sliceVertical.length - 1] : width / 2;
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
            sys.push(sliceHorizontal[i])
            tys.push(sliceHorizontal[i] + ah * i);
            tys.push(sliceHorizontal[i] + ah * (i + 1));
        }

        for (let i = 0; i < len; i++) {
            //原数据
            const osx = sx;
            const osy = sys[i];
            const osw = sw;
            const osh = sys[i + 1] - sys[i];
            const oData = this.getData(osx, osy, osw, osh);
            context?.putImageData(oData, osx, tys[2 * i])
            //沿Y轴拉伸的数据
            const ysx = sx;
            const ysy = sys[i + 1];
            const ysw = sw;
            const ysh = 1;
            const yData = this.getData(ysx, ysy, ysw, ysh);
            const yFragment = new ImageYFragment(ysx, ysy, yData, ah);
            context?.putImageData(yFragment.getData(), ysx, tys[2 * i + 1])
        }
    }

    sliceBottom(sliceVertical: Array<number>, sliceHorizontal: Array<number>) {
        const { width, height } = this.imageData;
        const { targetW,targetH } = this;
        const context = this.targetCanvas.getContext('2d');

        const len = sliceVertical.length;
        const sy = sliceHorizontal.length ? sliceHorizontal[sliceHorizontal.length - 1] : height / 2;
        const sh = sliceHorizontal.length ? targetH - sliceHorizontal[sliceHorizontal.length - 1]: height / 2;
        console.log(sh)
        if (len === 0) {
            const sx = 0;
            const sw = width / 2;
            const dataSource = this.getData(sx, sy, sw, sh)
            context?.putImageData(dataSource, sx, targetH - sy);
            console.log(targetH - sy)
            return
        }
    }

    /**
     * 水平拉伸
     * @param sliceVertical 水平方向分割坐标数组
     */
    createXFragments(sliceVertical?: Array<number>) {
        const { width: sourceW } = this.imageData;
        if (!sliceVertical || sliceVertical.length === 0) {
            const startX = Math.floor(sourceW / 3);
            const endX = Math.ceil(2 * sourceW / 3) - 1;
            sliceVertical = [startX, endX]
        }
        const len = sliceVertical.length;
        let sliceX = 0;
        //第一块为图片原数据
        const firstWidth = sliceVertical[0];
        const firstData = this.getData(0, 0, firstWidth, this.targetH)
        const firstFragment = new ImageFragment(0, 0, firstData)
        this.imageFragments.push(firstFragment);
        sliceX += firstWidth;

        //计算平均拉伸宽度
        const averageWidth = Math.floor((this.targetW - sourceW) / (len / 2));
        //第二块开始循环:拉伸->原数据
        for (let i = 0; i < len / 2; i++) {
            //拉伸的数据
            const xsx = sliceVertical[2 * i];
            const xsy = 0;
            const xsw = sliceVertical[2 * i + 1] - sliceVertical[2 * i] + 1;
            const xData = this.getData(xsx, xsy, xsw, this.targetH);
            const xFragment = new ImageXFragment(sliceX, xsy, xData, averageWidth + xsw);
            this.imageFragments.push(xFragment);
            sliceX += (averageWidth + xsw);
            //原数据
            const osx = sliceVertical[2 * i + 1] + 1;
            const osy = 0;
            let osw = 0;
            if (sliceVertical[2 * i + 2]) {
                osw = sliceVertical[2 * i + 2] - sliceX + 1;
            } else {
                osw = sourceW - sliceVertical[len - 1] - 1;
            }
            const oData = this.getData(osx, osy, osw, this.targetH);
            const oFragment = new ImageFragment(sliceX, osy, oData);
            this.imageFragments.push(oFragment);
            sliceX += osw;
        }

    }

    /**
     * 垂直拉伸
     * @param sliceHorizontal 垂直拉伸坐标数组
     */
    createYFragments(sliceHorizontal?: Array<number>) {
        const { width: sourceW, height: sourceH } = this.imageData;
        if (!sliceHorizontal || sliceHorizontal.length === 0) {
            const startY = Math.floor(sourceH / 3);
            const endY = Math.ceil(2 * sourceH / 3) - 1;
            sliceHorizontal = [startY, endY]
        }
        const len = sliceHorizontal.length;
        let sliceY = 0;
        //第一块为图片原数据
        const firstHeight = sliceHorizontal[0];
        const firstData = this.getData(0, 0, sourceW, firstHeight)
        const firstFragment = new ImageFragment(0, 0, firstData)
        this.imageFragments.push(firstFragment);
        sliceY += firstHeight;

        //计算平均拉伸宽度
        const averageHeight = Math.floor((this.targetH - sourceH) / (len / 2));
        //第二块开始循环:拉伸->原数据
        for (let i = 0; i < len / 2; i++) {
            //拉伸的数据
            const ysx = 0;
            const ysy = sliceHorizontal[2 * i];
            const ysh = sliceHorizontal[2 * i + 1] - sliceHorizontal[2 * i] + 1;
            const yData = this.getData(ysx, ysy, sourceW, ysh);
            const yFragment = new ImageYFragment(ysx, sliceY, yData, averageHeight + ysh);
            this.imageFragments.push(yFragment);
            sliceY += (averageHeight + ysh);
            //原数据
            const osx = 0;
            const osy = sliceHorizontal[2 * i + 1] + 1;
            let osh = 0;
            if (sliceHorizontal[2 * i + 2]) {
                osh = sliceHorizontal[2 * i + 2] - sliceY + 1;
            } else {
                osh = sourceW - sliceHorizontal[len - 1] - 1;
            }
            const oData = this.getData(osx, osy, sourceW, osh);
            const oFragment = new ImageFragment(osx, sliceY, oData);
            this.imageFragments.push(oFragment);
            sliceY += osh;
        }
    }

    /**
     * 水平与垂直拉伸
     */
    createXYFragment(sliceVertical?: Array<number>, sliceHorizontal?: Array<number>) {
        const { width: sourceW, height: sourceH } = this.imageData;
        if (!sliceVertical || sliceVertical.length === 0) {
            const startX = Math.floor(sourceW / 3);
            const endX = Math.ceil(2 * sourceW / 3) - 1;
            sliceVertical = [startX, endX]
        }
        if (!sliceHorizontal || sliceHorizontal.length === 0) {
            const startY = Math.floor(sourceH / 3);
            const endY = Math.ceil(2 * sourceH / 3) - 1;
            sliceHorizontal = [startY, endY]
        }

        const vLen = sliceVertical.length;
        const hLen = sliceHorizontal.length;
        //平均拉伸宽度
        const aw = Math.floor((this.targetW - sourceW) / (vLen / 2));
        const ah = Math.floor((this.targetH - sourceH) / (hLen / 2));

        //上边
        const topTargetHeight = sliceHorizontal[0];
        this.createXFragments(sliceVertical);
        //左边
    }
}


export default ImageFactory;
