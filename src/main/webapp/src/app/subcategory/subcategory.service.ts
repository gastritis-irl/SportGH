import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { Subcategory } from './subcategory.model';
import { CustomFieldConfig } from './customFieldConfig.model';

@Injectable({
    providedIn: 'root'
})
export class SubcategoryService extends AppService {

    getAll(): Observable<Subcategory[]> {
        const url: string = `${this.baseUrl}/subcategories`;
        return this.httpGet<Subcategory[]>(url);
    }

    getById(subcategoryId: number): Observable<Subcategory> {
        const url: string = `${this.baseUrl}/subcategories/${subcategoryId}`;
        return this.httpGet<Subcategory>(url);
    }

    getCustomFieldsById(subcategoryId: number): Observable<CustomFieldConfig[]> {
        const url: string = `${this.baseUrl}/subcategories/${subcategoryId}/customFields`;
        return this.httpGet<CustomFieldConfig[]>(url);
    }

    getByCategoryId(categoryId: number): Observable<Subcategory[]> {
        const url: string = `${this.baseUrl}/subcategories?Category=${categoryId}`;
        return this.httpGet<Subcategory[]>(url);
    }

    create(data: Subcategory): Observable<Subcategory> {
        const url: string = `${this.baseUrl}/subcategories`;
        return this.httpPost<Subcategory>(url, { body: data });
    }

    update(subcategoryId: number | undefined, newData: Subcategory): Observable<Subcategory> {
        const url: string = `${this.baseUrl}/subcategories/${subcategoryId}`;
        return this.httpPut<Subcategory>(url, { body: newData });
    }

    delete(subcategoryId: number | undefined): Observable<void> {
        const url: string = `${this.baseUrl}/subcategories/${subcategoryId}`;
        return this.httpDelete<void>(url);
    }
}
