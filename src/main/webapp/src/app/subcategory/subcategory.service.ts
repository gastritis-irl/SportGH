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
        return this.http.get<Subcategory[]>(url);
    }

    getByCategoryId(categoryId: number): Observable<Subcategory[]> {
        const url: string = `${this.baseUrl}/subcategories/categories/${categoryId}`;
        return this.http.get<Subcategory[]>(url);
    }
}
