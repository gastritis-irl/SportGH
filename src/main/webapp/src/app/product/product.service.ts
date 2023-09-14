import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { Product } from './product.model';
import { ProductPage } from './product-page.model';
import { Params } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ProductService extends AppService {

    getAllByParams(filterParams: Params): Observable<ProductPage> {
        const url: string = `${this.baseUrl}/products`;
        return this.httpGet<ProductPage>(url, { params: filterParams });
    }

    getById(id: number): Observable<Product> {
        const url: string = `${this.baseUrl}/products/${id}`;
        return this.httpGet<Product>(url);
    }

    create(product: Product): Observable<Product> {
        const url: string = `${this.baseUrl}/products`;
        return this.httpPost(url, { body: product });
    }

    edit(product: Product): Observable<Product> {
        const url: string = `${this.baseUrl}/products/${product.id}`;
        return this.httpPut(url, { body: product });
    }

    delete(productId: number): Observable<Product> {
        const url: string = `${this.baseUrl}/products/${productId}`;
        return this.httpDelete(url);
    }

    rent(productId: number): Observable<Product> {
        const url: string = `${this.baseUrl}/products/${productId}/rent`;
        return this.httpPut(url);
    }
}
