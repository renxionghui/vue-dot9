/*
 * @Descripttion: 向X轴,Y轴同时拉伸的Image片段
 * @Date: 2020-07-27 12:34:20
 */
import ImageFragment from './ImageFragment';
class ImageFillFragment extends ImageFragment {
    tw: number;
    th: number;

    /**
     * @param tw 拉伸的目标宽度
     * @param th 拉伸的目标高度
     */
    constructor(sx: number, sy: number, dataSource: ImageData, tw: number, th: number) {
        super(sx, sy, dataSource)
        this.tw = tw;
        this.th = th;
    }

    /**
     * @return: 沿XY轴拉伸的图片数据
     */
    getData(): ImageData {
        const { tw, th, dataSource } = this;
        const targetArray = new Uint8ClampedArray(tw * th * 4);

        for (let y = 0; y < th; y++) {
            for (let x = 0; x < tw * 4; x++) {
                targetArray[x + y * tw * 4] = dataSource.data[x % 4];
            }
        }
        const targetData = new ImageData(targetArray, tw, th)
        return targetData;
    }
}

export default ImageFillFragment;
