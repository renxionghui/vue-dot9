import ImageFragment from './ImageFragment';
declare class ImageXYFragment extends ImageFragment {
    tw: number;
    th: number;
    /**
     * @param tw 拉伸的目标宽度
     * @param th 拉伸的目标高度
     */
    constructor(sx: number, sy: number, sourceData: ImageData, tw: number, th: number);
    /**
     * 将1个像素的颜色铺满 tw th
     * @return: 沿XY轴拉伸的图片数据
     */
    getData(): ImageData;
}
export default ImageXYFragment;
