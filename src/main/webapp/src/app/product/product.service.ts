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

    getOwnerInfo(product: Product): Observable<User> {
        const url: string = `${this.baseUrl}/rent/user`;
        const params: Params = {
            productId: product.id,
        };
        return this.httpGet<User>(url, { params: params });
    }

    sendContactRequest(product: Product): Observable<void> {
        const url: string = `${this.baseUrl}/rent`;
        const params: Params = {
            productId: product.id
        };
        return this.httpPost<void>(url, { params: params });
    }
}
