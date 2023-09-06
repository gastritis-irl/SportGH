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

    getAll(pageNumber: number = 1, orderBy: string = 'name'): Observable<ProductPage> {
        const url: string = `${this.baseUrl}/products?pageNumber=${pageNumber}&orderBy=${orderBy}`;
        return this.http.get<ProductPage>(url);
    }

    getAllByParams(pageNumber: number, orderBy: string, filterParams: Params, paramNames: string[]): Observable<ProductPage> {
        let url: string = `${this.baseUrl}/products?pageNumber=${pageNumber}&orderBy=${orderBy}`;

        for (let paramName of paramNames) {
            if (filterParams[paramName]) {
                url += '&' + paramName + '=' + filterParams[paramName];
            }
        }
        console.log(url);

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
