import ImageFragment from './ImageFragment';
declare class ImageXFragment extends ImageFragment {
    tw: number;
    constructor(sx: number, sy: number, dataSource: ImageData, tw: number);
    getData(): ImageData;
}
export default ImageXFragment;
