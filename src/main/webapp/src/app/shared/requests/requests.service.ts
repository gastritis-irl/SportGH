import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../../app.service';
import { Request } from './requests.model';

@Injectable({
    providedIn: 'root'
})
export class RequestsService extends AppService {

    getMyRequests(): Observable<Request[]> {
        const url: string = `${this.baseUrl}/rent`;
        return this.httpGet<Request[]>(url);
    }
}
