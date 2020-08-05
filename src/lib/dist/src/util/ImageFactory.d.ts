declare class ImageFactory {
    private sourceW;
    private sourceH;
    private targetW;
    private targetH;
    private targetCanvas;
    private targetContext;
    private sourceContext;
    /**
     * @param imageData:下载的图片数据
     * @param targetW: 最终图片的宽度
     * @param targetH: 最终图片的高度
     */
    constructor(imageData: ImageData, targetW: number, targetH: number);
    /**
     * 根据指定的xy坐标以及宽高,得到对应的图片数据
     * @param sx 原始数据x坐标
     * @param sy 原始数据y坐标
     * @param sw 图片数据的宽度
     * @param sh 图片数据的高度
     * @return: 截取的图片数据
     */
    private getData;
    /**
     * 根据水平与垂直分割坐标,分割图片,然后经过拉伸生成最终的背景图片
     * @param sliceVertical 水平方向上分割的坐标数组
     * @param sliceHorizontal 垂直方向上分割的坐标数组
     * @return: 图片数据
     */
    createImage(sliceHorizontal?: Array<number>, sliceVertical?: Array<number>): string;
    /**
     * 分割图片数据
     * @param sliceHorizontal 水平方向上分割的数组
     * @param sliceVertical 垂直方向上分割的数组
     */
    private slice;
    /**
     * 处理上边框 原始数据-拉伸数据...-原始数据-拉伸数据
     */
    private sliceTop;
    /**
     * 处理右边框 原始数据-拉伸数据...-原始数据-拉伸数据
     */
    private sliceRight;
    /**
     * 处理下边框 拉伸数据-原始数据...-拉伸数据-原始数据
     */
    private sliceBottom;
    /**
     * 处理左边框 拉伸数据-原始数据...-拉伸数据-原始数据
     */
    private sliceLeft;
    /**
     * 处理中间区域
     * XY拉伸 - Y拉伸 - XY拉伸... - Y拉伸 - XY拉伸
     *  |        |       |         |       |
     * X拉伸  - 原始  - X拉伸...  - 原始  - X拉伸
     *  |        |       |         |       |
     * XY拉伸 - Y拉伸 - XY拉伸... - Y拉伸 - XY拉伸
     * ...      ...     ...       ...     ...
     *  |        |       |         |       |
     * X拉伸  - 原始  - X拉伸...  - 原始  - X拉伸
     *  |        |       |         |       |
     * XY拉伸 - Y拉伸 - XY拉伸... - Y拉伸 - XY拉伸
     */
    private sliceCenter;
}
export default ImageFactory;
