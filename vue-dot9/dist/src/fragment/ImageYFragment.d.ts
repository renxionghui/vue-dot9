import ImageFragment from './ImageFragment';
declare class ImageYFragment extends ImageFragment {
    th: number;
    /**
     * @param th 拉伸的目标高度
     */
    constructor(sx: number, sy: number, sourceData: ImageData, th: number);
    /**
     * 将1像素高度,sw宽度的颜色拉伸到th高度
     * @return: 沿Y轴拉伸的图片数据
     */
    getData(): ImageData;
}
export default ImageYFragment;
