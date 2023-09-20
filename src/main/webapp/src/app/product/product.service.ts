import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { Product } from './product.model';
import { ProductPage } from './product-page.model';
import { Params } from '@angular/router';
import { User } from '../user/user.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService extends AppService {

    getAllByParams(filterParams: Params): Observable<ProductPage> {
        const url: string = `${this.baseUrl}/products`;
        return this.http.get<ProductPage>(url, { params: filterParams });
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

    getOwnerInfo(product: Product): Observable<User> {
        const url: string = `${this.baseUrl}/rent/user`;
        const params: Params = {
            productId: product.id,
        };
        return this.http.get<User>(url, { params: params });
    }

    sendContactRequest(product: Product): Observable<void> {
        const url: string = `${this.baseUrl}/rent`;
        const params: Params = {
            productId: product.id
        };
        return this.http.post<void>(url, null, { params: params });
    }
}
