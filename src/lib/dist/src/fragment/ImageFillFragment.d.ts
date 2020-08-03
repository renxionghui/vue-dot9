import ImageFragment from './ImageFragment';
declare class ImageFillFragment extends ImageFragment {
    tw: number;
    th: number;
    constructor(sx: number, sy: number, dataSource: ImageData, tw: number, th: number);
    getData(): ImageData;
}
export default ImageFillFragment;
