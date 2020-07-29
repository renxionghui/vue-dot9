/*
 * @Descripttion: 向X轴拉伸的Image片段
 * @Date: 2020-07-27 09:40:03
 */
import ImageFragment from './ImageFragment';

class ImageXFragment extends ImageFragment {
    tw: number;
    /**
     * @param tw 拉伸的目标宽度
     */
    constructor(sx: number, sy: number, dataSource: ImageData, tw: number) {
        super(sx, sy, dataSource);
        this.tw = tw;
    }

    /**
     * @return: 沿X轴拉伸的图片数据
     */
    getData(): ImageData {
        const { sw, sh, tw, dataSource } = this;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = sw;
        canvas.height = sh;
        context?.putImageData(dataSource, 0, 0);
        const pxData = context?.getImageData(0, 0, 1, sh).data || [];
        const targetArray = new Uint8ClampedArray(tw * sh * 4);
        for (let y = 0; y < sh; y++) {
            for (let x = 0; x < tw * 4; x++) {
                targetArray[x + y * tw * 4] = pxData[x % 4 + y * 4]
            }
        }
        const targetData = new ImageData(targetArray, tw, sh)
        return targetData;
    }
}

export default ImageXFragment;
