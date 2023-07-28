import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    protected readonly baseUrl: string = 'http://localhost:8080/api';

    constructor(protected http: HttpClient) {
    }
}
