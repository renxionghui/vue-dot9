import ImageFragment from './ImageFragment';
declare class ImageXFragment extends ImageFragment {
    tw: number;
    /**
     * @param tw 拉伸的目标宽度
     */
    constructor(sx: number, sy: number, sourceData: ImageData, tw: number);
    /**
     * 将1像素宽度,sh高度的颜色拉伸到tw宽度
     * @return: 沿X轴拉伸的图片数据
     */
    getData(): ImageData;
}
export default ImageXFragment;
