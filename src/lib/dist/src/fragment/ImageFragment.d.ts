declare class ImageFragment {
    sx: number;
    sy: number;
    sw: number;
    sh: number;
    sourceData: ImageData;
    /**
     * @param sx 数据原始X轴坐标
     * @param sy 数据原始Y轴坐标
     * @param sourceData 原始图片数据
     */
    constructor(sx: number, sy: number, sourceData: ImageData);
    /**
     * @return: 返回图片数据
     */
    getData(): ImageData;
}
export default ImageFragment;
