/*
 * @Descripttion: 类似于android开发中的.9图片,图片拉伸不失真
 * @Date: 2020-07-25 16:43:50
 */
import ImageLoader from './util/ImageLoader';
import ImageFactory from './util/ImageFactory';
class Dot9 {
    el: HTMLElement;
    options: Options;

    /** 
     * @param el 需要生成设置图片背景的dom
     * @param options 设置对应的参数
     * @param options.source 图片地址
     * @param options.sliceVertical 垂直方向上分割的坐标位置
     * @param options.sliceHorizontal 水平方向上分割的坐标位置
     */
    constructor(el: HTMLElement, options: Options) {
        this.el = el;
        this.options = options;
    }

    /**
     * 请求图片数据,创建背景图片
     */
    create() {
        const { source, sliceHorizontal, sliceVertical } = this.options;
        ImageLoader.load(source).then((imageData: ImageData) => {
            const { width, height } = getComputedStyle(this.el);
            const targetW = parseInt(width, 10);
            const targetH = parseInt(height, 10);
            const factory = new ImageFactory(imageData, targetW, targetH);
            const image = factory.createImage(sliceHorizontal, sliceVertical);
            this.el.style.cssText += `background-image:url('${image}');background-repeat:no-repeat;background-size:100% 100%`;
        }).catch(err => {
            console.error(err);
        })
    }
}


interface Options {
    source: string;
    resizable: boolean;
    sliceVertical?: Array<number>;
    sliceHorizontal?: Array<number>;
}

export default Dot9