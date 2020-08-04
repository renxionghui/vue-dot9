import ImageFragment from './ImageFragment';
declare class ImageFillFragment extends ImageFragment {
    tw: number;
    th: number;
    /**
     * @param tw 拉伸的目标宽度
     * @param th 拉伸的目标高度
     */
    constructor(sx: number, sy: number, dataSource: ImageData, tw: number, th: number);
    /**
     * @return: 沿XY轴拉伸的图片数据
     */
    getData(): ImageData;
}
export default ImageFillFragment;
