import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppService} from "../app.service";

@Injectable({
    providedIn: 'root'
})
export class ProductService extends AppService {

    getProducts(): Observable<any> {
        const url: string = `${this.baseUrl}/products`;
        return this.http.get<any>(url);
    }
}
