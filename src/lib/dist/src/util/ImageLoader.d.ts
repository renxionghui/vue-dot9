declare class ImageLoader {
    /**
     * @msg: 下载图片转换成dataUrl,绘制在画布上,得到需要处理的原始ImageData
     * @param 图片地址
     * @return: 图片下载数据Promise
     */
    static load(source: string, filter?: string): Promise<ImageData>;
}
export default ImageLoader;
