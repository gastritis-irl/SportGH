import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl: string = 'http://localhost:8080';

    constructor(private http: HttpClient) {
    }

    getUsers(): Observable<any> {
        const url: string = `${this.baseUrl}/api/users`;
        return this.http.get<any>(url);
    }
}
