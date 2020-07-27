/*
 * @Descripttion: 将图片分割处理
 * @Date: 2020-07-27 09:18:19
 */
import ImageFragment from '../fragment/ImageXFragment';
import ImageXFragment from '../fragment/ImageXFragment';
import ImageYFragment from '../fragment/ImageXFragment';
import ImageXYFragment from '../fragment/ImageXFragment';
class ImageSlicer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D | null;

    imageFragmentDatas: Array<ImageFragment> = [];
    /**
     * @param imageData:下载的图片数据
     */
    constructor(imageData: ImageData) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    }

    /**
     * @param sw 原图片宽度
     * @param sh 原图片高度
     * @param tw 生成的目标图片宽度
     * @param tw 生成的目标图片高度
     * @param sliceInfo 分割图片的数组信息,分为X轴与Y轴
     * @param sliceInfo.x X轴分割的坐标数组,数组元素需要是偶数个
     * @param sliceInfo.y Y轴分割的坐标数组,数组元素需要是偶数个
     */
    slice(sw: number, sh: number, tw: number, th: number, sliceInfo = { x: [sw / 3, 2 * sw / 3], y: [sh / 3, 2 * sh / 3] }) {
        if (sliceInfo.x.length % 2 !== 0 || sliceInfo.y.length % 2 !== 0) {
            throw new Error('请确保传入的x轴,y轴的数组中的数据的长度为偶数')
        }
        const { x: xArr, y: yArr } = sliceInfo;


    }

    /**
     * 计算获取每一个图片片段的标记的数组,
     * 不需要拉伸的标记为O
     * 沿X轴拉伸的标记为X
     * 沿Y轴拉伸的标记为Y
     * 沿XY轴拉伸的标记为XY
     * @param {SliceInfo} sliceInfo
     * @return {Array<Mark>} 带上拉伸标记的数组
     */
    createMarks(sliceInfo: SliceInfo): Array<Mark> {
        const marks: Array<Mark> = []
        const { x: xArr, y: yArr } = sliceInfo;
        const xLen = xArr?.length || 2;
        const yLen = yArr?.length || 2;
        for (let y = 0; y < 2 * yLen + 1; y++) {
            for (let x = 0; x < 2 * xLen + 1; x++) {
                if (x % 2 === 0 && y % 2 === 0) {
                    marks.push({ mark: 'O', x, y })
                } else if (x % 2 === 1 && y % 2 === 0) {
                    marks.push({ mark: 'X', x, y })
                } else if (x % 2 === 0 && y % 2 === 1) {
                    marks.push({ mark: 'Y', x, y })
                } else {
                    marks.push({ mark: 'XY', x, y })
                }
            }
        }

        return marks;
    }

    createXFragment(tw: number, xArr: Array<number>, yArr: Array<number>) {
        let xTotalTargetWidth: number = 0;
        const xLen: number = xArr.length;
        const yLen: number = yArr.length;
        for (let i = 0; i < xLen / 2; i++) {
            xTotalTargetWidth += (xArr[2 * i + 1] - xArr[2 * i]);
        }
        //计算X轴需要拉伸的数据:第一行以及最后一行
        for (let i = 0; i < xLen / 2; i++) {
            //片段原始x坐标
            const fsx: number = xArr[2 * i]
            const fsw: number = xArr[2 * i + 1] - fsx;
            const ftw: number = (tw - xTotalTargetWidth) / xLen;

            const fsyFirst: number = yArr[0];
            const fshFirst: number = yArr[1] - yArr[0];
            const fragmentDataFirst: ImageData = this.context?.getImageData(fsx, fsyFirst, fsw, fshFirst) || new ImageData(0, 0);
            const imageFragmentFirst: ImageXFragment = new ImageXFragment(fsx, fsyFirst, fsw, fshFirst, fragmentDataFirst, ftw)
            this.imageFragmentDatas.push(imageFragmentFirst);

            const fsyLast: number = yArr[yLen - 2];
            const fshLast: number = yArr[yLen - 1] - yArr[yLen - 2];
            const fragmentDataLast: ImageData = this.context?.getImageData(fsx, fsyLast, fsw, fshLast) || new ImageData(0, 0);
            const imageFragmentLast: ImageXFragment = new ImageXFragment(fsx, fsyLast, fsw, fshLast, fragmentDataLast, ftw);
            this.imageFragmentDatas.push(imageFragmentLast);
        }
    }

    createYFragment() {

    }
}

interface SliceInfo {
    x?: Array<number>
    y?: Array<number>
}

interface Mark {
    mark: string
    x: number
    y: number
}


export default ImageSlicer;
