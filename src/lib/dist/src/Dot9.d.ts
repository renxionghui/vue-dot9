declare class Dot9 {
    el: HTMLElement;
    options: Options;
    constructor(el: HTMLElement, options: Options);
    create(): void;
}
interface Options {
    source: string;
    fill?: boolean | string;
    sliceVertical?: Array<number>;
    sliceHorizontal?: Array<number>;
}
export default Dot9;
