import { CustomFieldValue } from '../subcategory/customFieldConfig.model';

export interface Product {

    id?: number,
    publicContact?: boolean,
    name?: string,
    createdAt?: Date,
    updatedAt?: Date,
    description?: string,
    locationLng?: number,
    locationLat?: number,
    rentPrice?: number,
    categoryId?: number,
    categoryName?: string,
    subCategoryId?: number,
    subCategoryName?: string,
    customFieldValues?: CustomFieldValue[],
    userId?: number,
    userUid?: string,
    username?: string,
    imageIds?: number[],
    imageDataUrls?: string[],
    imagesLoaded?: boolean;
}
