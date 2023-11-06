import { Point } from 'leaflet';

export interface Product {

    id?: number,
    publicContact?: boolean,
    name?: string,
    description?: string,
    location?: string,
    locationLngLat?: Point,
    rentPrice?: number,
    categoryId?: number,
    categoryName?: string,
    subCategoryId?: number,
    subCategoryName?: string,
    userId?: number,
    userUid?: string,
    username?: string,
    imageIds?: number[],
    imageDataUrls?: string[],
    imagesLoaded?: boolean;
}
