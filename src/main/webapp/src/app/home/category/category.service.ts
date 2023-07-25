import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppService} from "../../app.service";

@Injectable({
    providedIn: 'root'
})
export class CategoryService extends AppService {

    getCategories(): Observable<any> {
        const url: string = `${this.baseUrl}/categories`;
        return this.http.get<any>(url);
    }
}
