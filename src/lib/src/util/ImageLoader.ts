/*
 * @Descripttion: 图片下载
 * @Date: 2020-07-25 17:00:09
 */
class ImageLoader {
    /**
     * @msg: 图片下载转成dataUrl
     * @param {string} 图片地址 
     * @return: 图片下载数据Promise
     */
    static load(source: string): Promise<ImageData> {
        const image = new Image();
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        return new Promise((resolve, reject) => {
            fetch(source).then(res => {
                return res.blob();
            }).then(blob => {
                let reader = new FileReader();
                reader.readAsDataURL(new Blob([blob]));
                reader.onload = function (e) {
                    if (typeof e.target?.result === 'string') {
                        image.src = e.target.result;
                    }
                };
                image.onload = function () {
                    context?.drawImage(image, 0, 0);
                    resolve(context?.getImageData(0, 0, image.width, image.height))
                }
            }).catch(err => {
                reject(err);
            })
        })
    }
}

export default ImageLoader;