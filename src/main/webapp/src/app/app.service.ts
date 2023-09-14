import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './environment';
import { Observable } from 'rxjs';
import { Product } from './product/product.model';
import { Category } from './category/category.model';
import { Subcategory } from './subcategory/subcategory.model';

interface Options {

    body?: string | string[] | number | number[] | boolean | boolean[] | undefined |
        Product | Product[] | Category | Category[] | Subcategory | Subcategory[],
    headers?: HttpHeaders | { [header: string]: string | string[] },
    params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
}

@Injectable({
    providedIn: 'root'
})
export class AppService {

    protected readonly baseUrl: string = `${environment.baseURL}/api`;

    constructor(protected http: HttpClient) {
    }

    httpGet<T>(url: string, options: Options = {}): Observable<T> {
        return this.http.get<T>(url, {
            headers: options.headers,
            params: options.params,
        });
    }

    httpPost<T>(url: string, options: Options = {}): Observable<T> {
        return this.http.post<T>(url, options.body, {
            headers: options.headers,
            params: options.params,
        });
    }

    httpPut<T>(url: string, options: Options = {}): Observable<T> {
        return this.http.put<T>(url, options.body, {
            headers: options.headers,
            params: options.params,
        });
    }

    httpDelete<T>(url: string, options: Options = {}): Observable<T> {
        return this.http.delete<T>(url, {
            headers: options.headers,
            params: options.params,
        });
    }
}
