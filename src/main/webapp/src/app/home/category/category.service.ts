import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppService} from "../../app.service";
import {Category} from "./category.model";

@Injectable({
    providedIn: 'root'
})
export class CategoryService extends AppService {

    getCategories(): Observable<Category[]> {
        const url: string = `${this.baseUrl}/categories`;
        return this.http.get<Category[]>(url);
    }
}
