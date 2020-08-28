/**
 * 滤镜
 */
declare class ImageFilter {
    private filter;
    constructor(filter: Filter);
}
declare enum Filter {
    Gray = 0,
    GaussianBlur = 1
}
