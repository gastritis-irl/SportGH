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

    getAllByParams(filterParams: Params, paramNames: string[]): Observable<ProductPage>  {
        let url: string = `${this.baseUrl}/products?`;

        for (const paramName of paramNames) {
            if (filterParams[paramName]) {
                url += '&' + paramName + '=' + filterParams[paramName];
            }
        }

        return this.http.get<ProductPage>(url);
    }

    getById(id: number): Observable<Product> {
        const url: string = `${this.baseUrl}/products/${id}`;
        return this.http.get<Product>(url);
    }

    create(product: Product): Observable<Product> {
        const url: string = `${this.baseUrl}/products`;
        return this.http.post(url, product);
    }

    edit(product: Product): Observable<Product> {
        const url: string = `${this.baseUrl}/products/${product.id}`;
        return this.http.put(url, product);
    }

    delete(productId: number): Observable<Product> {
        const url: string = `${this.baseUrl}/products/${productId}`;
        return this.http.delete(url);
    }

    rent(productId: number): Observable<Product> {
        const url: string = `${this.baseUrl}/products/${productId}/rent`;
        return this.http.put(url, {});  // body: renter?
    }
}
