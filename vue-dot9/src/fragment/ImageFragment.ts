/*
 * Image片段,包含原始坐标,原始宽高,原始图片数据等信息
 */
class ImageFragment {
    public sx: number;
    public sy: number;
    public sw: number;
    public sh: number;
    public sourceData: ImageData;

    /**
     * @param sx 数据原始X轴坐标
     * @param sy 数据原始Y轴坐标
     * @param sourceData 原始图片数据
     */
    constructor(sx: number, sy: number, sourceData: ImageData) {
        this.sx = sx;
        this.sy = sy;
        this.sw = sourceData.width;
        this.sh = sourceData.height;
        this.sourceData = sourceData;
    }

    /**
     * @return: 返回图片数据
     */
    public getData(): ImageData {
        return this.sourceData;
    }

}

export default ImageFragment;
