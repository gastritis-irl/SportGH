import { customFieldConfig } from './customFieldConfig.model';

export interface Subcategory {

    id?: number;
    name?: string;
    categoryId?: number;
    customFields: customFieldConfig[];
}
