import ImageFragment from './ImageFragment';
declare class ImageYFragment extends ImageFragment {
    th: number;
    constructor(sx: number, sy: number, dataSource: ImageData, th: number);
    getData(): ImageData;
}
export default ImageYFragment;
