/*
 * @Descripttion: 向X轴,Y轴同时拉伸的Image片段
 * @Date: 2020-07-27 12:34:20
 */

import ImageFragment from './ImageFragment';
class ImageXYFragment extends ImageFragment {
    tw: number;
    th: number;
    fill: boolean;

    /**
     * @param tw 拉伸的目标宽度
     * @param th 拉伸的目标高度
     * @param fill 是否填充
     */
    constructor(sx: number, sy: number, dataSource: ImageData, tw: number, th: number, fill = true) {
        super(sx, sy, dataSource)
        this.tw = tw;
        this.th = th;
        this.fill = fill;
    }

    /**
     * @return: 沿XY轴拉伸的图片数据
     */
    getData(): ImageData {
        const { sw, sh, tw, th, dataSource, fill } = this;
        let pxData = null;
        const targetArray = new Uint8ClampedArray(tw * th * 4);
        if (fill) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = sw;
            canvas.height = sh;
            context?.putImageData(dataSource, 0, 0);
            pxData = context?.getImageData(0, 0, 1, 1).data || [];      
        } else {
            pxData = [0, 0, 0, 0];
        }

        for (let y = 0; y < th; y++) {
            for (let x = 0; x < tw * 4; x++) {
                targetArray[x + y * tw * 4] = pxData[x % 4];
            }
        }
        const targetData = new ImageData(targetArray, tw, th)
        return targetData;

    }
}
