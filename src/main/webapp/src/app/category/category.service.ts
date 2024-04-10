import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { Category } from './category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService extends AppService {

    getAll(): Observable<Category[]> {
        const url: string = `${this.baseUrl}/categories`;
        return this.httpGet<Category[]>(url);
    }

    getById(categoryId: number): Observable<Category> {
        const url: string = `${this.baseUrl}/categories/${categoryId}`;
        return this.httpGet<Category>(url);
    }

    create(data: Category): Observable<Category> {
        const url: string = `${this.baseUrl}/categories`;
        return this.httpPost<Category>(url, { body: data });
    }

    update(categoryId: number | undefined, newData: Category): Observable<Category> {
        const url: string = `${this.baseUrl}/categories/${categoryId}`;
        return this.httpPut<Category>(url, { body: newData });
    }

    delete(categoryId: number | undefined): Observable<void> {
        const url: string = `${this.baseUrl}/categories/${categoryId}`;
        return this.httpDelete<void>(url);
    }
}
