/*
 * 向X轴拉伸的Image片段
 */
import ImageFragment from './ImageFragment';

class ImageXFragment extends ImageFragment {
    public tw: number;
    /**
     * @param tw 拉伸的目标宽度
     */
    constructor(sx: number, sy: number, sourceData: ImageData, tw: number) {
        super(sx, sy, sourceData);
        this.tw = tw;
    }

    /**
     * 将1像素宽度,sh高度的颜色拉伸到tw宽度
     * @return: 沿X轴拉伸的图片数据
     */
    public getData(): ImageData {
        const { sh, tw, sourceData } = this;
        const pxData: Uint8ClampedArray = sourceData.data;
        const targetArray: Uint8ClampedArray = new Uint8ClampedArray(tw * sh * 4);
        for (let y = 0; y < sh; y++) {
            for (let x = 0; x < tw * 4; x++) {
                targetArray[x + y * tw * 4] = pxData[x % 4 + y * 4]
            }
        }
        const targetData: ImageData = new ImageData(targetArray, tw, sh)
        return targetData;
    }
}

export default ImageXFragment;
