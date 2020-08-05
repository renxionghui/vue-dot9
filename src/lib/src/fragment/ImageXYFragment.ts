/*
 * 向X轴,Y轴同时拉伸的Image片段
 */
import ImageFragment from './ImageFragment';
class ImageXYFragment extends ImageFragment {
    public tw: number;
    public th: number;

    /**
     * @param tw 拉伸的目标宽度
     * @param th 拉伸的目标高度
     */
    constructor(sx: number, sy: number, sourceData: ImageData, tw: number, th: number) {
        super(sx, sy, sourceData)
        this.tw = tw;
        this.th = th;
    }

    /**
     * 将1个像素的颜色铺满 tw th
     * @return: 沿XY轴拉伸的图片数据
     */
    public getData(): ImageData {
        const { tw, th, sourceData } = this;
        const pxData: Uint8ClampedArray = sourceData.data;
        const targetArray: Uint8ClampedArray = new Uint8ClampedArray(tw * th * 4);
        for (let y = 0; y < th; y++) {
            for (let x = 0; x < tw * 4; x++) {
                targetArray[x + y * tw * 4] = pxData[x % 4];
            }
        }
        const targetData: ImageData = new ImageData(targetArray, tw, th)
        return targetData;
    }
}

export default ImageXYFragment;
