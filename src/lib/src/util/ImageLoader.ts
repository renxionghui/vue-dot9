/*
import { filter } from 'vue/types/umd';
 * @Descripttion: 图片下载
 * @Date: 2020-07-25 17:00:09
 */
class ImageLoader {
    /**
     * @msg: 下载图片转换成dataUrl,绘制在画布上,得到需要处理的原始ImageData
     * @param 图片地址 
     * @return: 图片下载数据Promise
     */
    static load(source: string,filter = 'none'): Promise<ImageData> {
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
                    image.style.filter = filter;
                    document.body.appendChild(image);
                    image.style.display = 'none';
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context?.drawImage(image, 0, 0);
                    // document.removeChild(image)
                    resolve(context?.getImageData(0, 0, image.width, image.height))
                }
            }).catch(err => {
                reject(err);
            })
        })
    }
}

export default ImageLoader;