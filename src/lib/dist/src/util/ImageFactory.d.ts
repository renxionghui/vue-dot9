declare class ImageFactory {
    imageData: ImageData;
    targetW: number;
    targetH: number;
    targetCanvas: HTMLCanvasElement;
    sourceCanvas: HTMLCanvasElement;
    constructor(imageData: ImageData, targetW: number, targetH: number);
    private getData;
    createImage(sliceVertical?: Array<number>, sliceHorizontal?: Array<number>): string;
    slice(sliceVertical?: Array<number>, sliceHorizontal?: Array<number>): void;
    merge(): string;
    sliceTop(sliceVertical: Array<number>, sliceHorizontal: Array<number>): void;
    sliceRight(sliceVertical: Array<number>, sliceHorizontal: Array<number>): void;
    sliceBottom(sliceVertical: Array<number>, sliceHorizontal: Array<number>): void;
    sliceLeft(sliceVertical: Array<number>, sliceHorizontal: Array<number>): void;
    sliceCenter(): void;
}
export default ImageFactory;
