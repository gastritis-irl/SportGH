import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppService} from "../app.service";
import {User} from "./user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService extends AppService {

    getUsers(): Observable<User[]> {
        const url: string = `${this.baseUrl}/users`;
        return this.http.get<User[]>(url);
    }
}
