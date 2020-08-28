declare class Dot9 {
    el: HTMLElement;
    options: Options;
    /**
     * @param el 需要生成设置图片背景的dom
     * @param options 设置对应的参数
     * @param options.source 图片地址
     * @param options.sliceVertical 垂直方向上分割的坐标位置
     * @param options.sliceHorizontal 水平方向上分割的坐标位置
     */
    constructor(el: HTMLElement, options: Options);
    /**
     * 请求图片数据,创建背景图片
     */
    create(): void;
}
interface Options {
    source: string;
    resizable: boolean;
    sliceVertical?: Array<number>;
    sliceHorizontal?: Array<number>;
    filter?: string;
}
export default Dot9;
