import ImageLoader from './ImageLoader';

/*
 * @Descripttion: 类似于android开发中的.9图片,图片拉伸不失真
 * @Author: renxionghui
 * @Date: 2020-07-25 16:43:50
 * @LastEditors: renxionghui
 * @LastEditTime: 2020-07-27 08:59:57
 */ 
class Dot9 {
    el: HTMLElement;
    options: Options;
    
    /** 
     * @param {HTMLElement} el 需要生成设置图片背景的dom
     * @param {Options} options 设置对应的参数
     */
    constructor(el: HTMLElement, options: Options) {
        this.el = el;
        this.options = options;
    }

    /**
     * 请求图片数据,创建背景图片
     */
    create() {
        const { url } = this.options;
        ImageLoader.load(url).then(data => {
            console.log(data)
        })
    }
}

interface Options{
    url:string,
    fill?:boolean
}

export default Dot9