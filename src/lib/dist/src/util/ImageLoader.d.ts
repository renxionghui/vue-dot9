declare class ImageLoader {
    /**
     * @msg: 加载图片,得到需要处理的原始ImageData
     * @param 图片地址
     * @return: 图片下载数据Promise
     */
    static load(source: string): Promise<ImageData>;
}
export default ImageLoader;
