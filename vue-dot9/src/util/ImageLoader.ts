/*
 * 图片加载
 */
class ImageLoader {
    /**
     * @msg: 加载图片,得到需要处理的原始ImageData
     * @param 图片地址 
     * @return: 图片下载数据Promise
     */
    public static load(source: string): Promise<ImageData> {
        const image: HTMLImageElement = new Image();
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const context: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');
        return new Promise((resolve: Function, reject: Function) => {
            image.src = source;
            image.addEventListener('load', function () {
                const ratio: number = window.devicePixelRatio || 1;
                const { width, height } = image;
                canvas.width = width * ratio;
                canvas.height = height * ratio;
                context.drawImage(image, 0, 0, width * ratio, height * ratio);
                resolve(context.getImageData(0, 0, width * ratio, height * ratio))
            }, { once: true })
            image.addEventListener('error', function (error: ErrorEvent) {
                reject(error)
            }, { once: true })
        })
    }
}

export default ImageLoader;