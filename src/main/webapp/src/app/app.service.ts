import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    protected readonly baseUrl: string = `${environment.baseURL}/api`;

    constructor(protected http: HttpClient) {
    }
}
