import ImageFragment from './ImageFragment';
declare class ImageXFragment extends ImageFragment {
    tw: number;
    /**
     * @param tw 拉伸的目标宽度
     */
    constructor(sx: number, sy: number, dataSource: ImageData, tw: number);
    /**
     * @return: 沿X轴拉伸的图片数据
     */
    getData(): ImageData;
}
export default ImageXFragment;
