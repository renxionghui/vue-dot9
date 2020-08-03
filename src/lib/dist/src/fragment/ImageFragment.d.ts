declare class ImageFragment {
    sx: number;
    sy: number;
    sw: number;
    sh: number;
    dataSource: ImageData;
    constructor(sx: number, sy: number, dataSource: ImageData);
    getData(): ImageData;
}
export default ImageFragment;
