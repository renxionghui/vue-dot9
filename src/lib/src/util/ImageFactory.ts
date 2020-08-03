/*
 * @Descripttion: 将图片分割处理
 * @Date: 2020-07-27 09:18:19
 */
import ImageXFragment from '../fragment/ImageXFragment';
import ImageYFragment from '../fragment/ImageYFragment';
// import ImageXYFragment from '../fragment/ImageXYFragment';
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
            sliceHorizontal = [];
            sliceVertical = [];
        } else if (targetW > sourceW && targetH === sourceH) {//只拉伸X轴
            // sliceHorizontal = [];
            sliceVertical = [];
        } else if (targetW === sourceW && targetH > sourceH) {//只拉伸Y轴
            // sliceVertical = [];
            sliceHorizontal = [];
        }

        this.sliceTop(sliceVertical, sliceHorizontal);
        this.sliceRight(sliceVertical, sliceHorizontal);
        this.sliceBottom(sliceVertical, sliceHorizontal);
        this.sliceLeft(sliceVertical, sliceHorizontal);
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

    sliceRight(sliceVertical: Array<number>, sliceHorizontal: Array<number>) {
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

    sliceBottom(sliceVertical: Array<number>, sliceHorizontal: Array<number>) {
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

    sliceLeft(sliceVertical: Array<number>, sliceHorizontal: Array<number>) {
        const { width, height } = this.imageData;
        const { targetW, targetH } = this;
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

    sliceCenter(){
        
    }
}


export default ImageFactory;
