import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { Subcategory } from './subcategory.model';


@Injectable({
    providedIn: 'root'
})
export class SubcategoryService extends AppService {

    getAll(): Observable<Subcategory[]> {
        const url: string = `${this.baseUrl}/subcategories`;
        return this.httpGet<Subcategory[]>(url);
    }

    getByCategoryId(categoryId: number): Observable<Subcategory[]> {
        const url: string = `${this.baseUrl}/subcategories?Category=${categoryId}`;
        return this.httpGet<Subcategory[]>(url);
    }

    create(data: Subcategory): Observable<Subcategory> {
        const url: string = `${this.baseUrl}/subcategories`;
        return this.httpPost<Subcategory>(url, { body: data });
    }

    delete(subcategoryId: number | undefined): Observable<void> {
        const url: string = `${this.baseUrl}/subcategories/${subcategoryId}`;
        return this.httpDelete<void>(url);
    }
}
