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
        if (targetW < sourceW || targetH < sourceH || (targetW === sourceW && targetH === sourceH)) {
            this.imageFragments.push(new ImageFragment(0, 0, this.imageData))
        } else if (targetW > sourceW && targetH === sourceH) {//只拉伸X轴
            this.createXFragments(sourceH, sliceVertical)
        } else if (targetW === sourceW && targetH > sourceH) {
            this.createYFragments(sliceHorizontal)
        } else {
            this.createXYFragment(sliceVertical, sliceHorizontal);
        }
    }

    /**
     * 合并图片数据
     */
    merge() {
        const targetContext = this.targetCanvas.getContext('2d');
        for (let i = 0; i < this.imageFragments.length; i++) {
            const fragment = this.imageFragments[i]
            targetContext?.putImageData(fragment.getData(), fragment.sx, fragment.sy);
        }
        return this.targetCanvas.toDataURL();
    }

    /**
     * 水平拉伸
     * @param sliceVertical 水平方向分割坐标数组
     */
    createXFragments(targetHeight: number, sliceVertical?: Array<number>) {
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
        const firstData = this.getData(0, 0, firstWidth, targetHeight)
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
            const xData = this.getData(xsx, xsy, xsw, targetHeight);
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
            const oData = this.getData(osx, osy, osw, targetHeight);
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
        this.createXFragments(topTargetHeight, sliceVertical);
        //左边
    }
}


export default ImageFactory;
