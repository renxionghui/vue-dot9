/*
 * @Descripttion: Image片段,包含原始坐标,原始宽高,原始图片数据等信息
 * @Date: 2020-07-27 09:27:20
 */
class ImageFragment {
    sx: number;
    sy: number;
    sw: number;
    sh: number;
    dataSource: ImageData;

    /**
     * @param sx 数据原始X轴坐标
     * @param sy 数据原始Y轴坐标
     * @param sw 数据原始宽度
     * @param sh 数据原始高度
     * @param dataSource 原始图片数据
     */
    constructor(sx: number, sy: number, sw: number, sh: number, dataSource: ImageData) {
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
        this.dataSource = dataSource;
    }

    /**
     * @return: 返回图片数据
     */
    getData(): ImageData {
        return this.dataSource;
    }

}

export default ImageFragment;
