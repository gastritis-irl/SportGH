import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppService} from "../app.service";
import {Product} from "./product.model";

@Injectable({
    providedIn: 'root'
})
export class ProductService extends AppService {

    getProducts(): Observable<Product[]> {
        const url: string = `${this.baseUrl}/products`;
        return this.http.get<Product[]>(url);
    }
}
