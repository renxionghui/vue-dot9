/*
 * 向Y轴拉伸的Image片段
 */
import ImageFragment from './ImageFragment';

class ImageYFragment extends ImageFragment {
    public th: number;
    /**
     * @param th 拉伸的目标高度
     */
    constructor(sx: number, sy: number, sourceData: ImageData, th: number) {
        super(sx, sy, sourceData)
        this.th = th;
    }

    /**
     * 将1像素高度,sw宽度的颜色拉伸到th高度
     * @return: 沿Y轴拉伸的图片数据
     */
    public getData(): ImageData {
        const { sw, th, sourceData } = this;
        const pxData: Uint8ClampedArray = sourceData.data;
        const targetArray: Uint8ClampedArray = new Uint8ClampedArray(sw * th * 4);
        for (let y = 0; y < th; y++) {
            for (let x = 0; x < sw * 4; x++) {
                targetArray[x + y * sw * 4] = pxData[x % (sw * 4)]
            }
        }
        const targetData: ImageData = new ImageData(targetArray, sw, th)
        return targetData;
    }
}

export default ImageYFragment;
