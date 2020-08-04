import ImageFragment from './ImageFragment';
declare class ImageYFragment extends ImageFragment {
    th: number;
    /**
     * @param th 拉伸的目标高度
     */
    constructor(sx: number, sy: number, dataSource: ImageData, th: number);
    /**
     * @return: 沿Y轴拉伸的图片数据
     */
    getData(): ImageData;
}
export default ImageYFragment;
