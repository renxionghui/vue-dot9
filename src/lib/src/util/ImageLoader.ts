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
    static load(url: string): Promise<string | ArrayBuffer | null | undefined> {
        return new Promise((resolve, reject) => {
            fetch(url).then(res => {
                return res.blob();
            }).then(blob => {
                let reader = new FileReader();
                reader.readAsDataURL(new Blob([blob]));
                reader.onload = function (e) {
                    resolve(e.target?.result)
                };
            }).catch(err => {
                reject(err);
            })
        })
    }
}

export default ImageLoader;