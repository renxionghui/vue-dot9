/*
 * @Descripttion: 向Y轴拉伸的Image片段
 * @Date: 2020-07-27 10:27:13
 */
import ImageFragment from './ImageFragment';

class ImageYFragment extends ImageFragment {
    th: number;
    /**
     * @param th 拉伸的目标高度
     */
    constructor(sx: number, sy: number, dataSource: ImageData, th: number) {
        super(sx, sy, dataSource)
        this.th = th;
    }

    /**
     * @return: 沿Y轴拉伸的图片数据
     */
    getData(): ImageData {
        const { sw, sh, th, dataSource } = this;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = sw;
        canvas.height = sh;
        context?.putImageData(dataSource, 0, 0);
        const pxData = context?.getImageData(0, 0, sw, 1).data || [];
        const targetArray = new Uint8ClampedArray(sw * th * 4);
        for (let y = 0; y < th; y++) {
            for (let x = 0; x < sw * 4; x++) {
                targetArray[x + y * sw * 4] = pxData[x % (sw * 4)]

            }

        }
        const targetData = new ImageData(targetArray, sw, th)
        return targetData;
    }
}

export default ImageYFragment;
