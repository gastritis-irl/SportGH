export interface Product {

    id?: number,
    publicContact?: boolean,
    name?: string,
    description?: string,
    location?: string,
    rentPrice?: number,
    categoryId?: number,
    categoryName?: string,
    subCategoryId?: number,
    subCategoryName?: string,
    userId?: number,
    username?: string,
    imageIds?: number[],
    imageDataUrls?: string[],
    imagesLoaded?: boolean;
}
