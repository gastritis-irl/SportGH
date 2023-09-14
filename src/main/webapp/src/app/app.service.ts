import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './environment';
import { Observable } from 'rxjs';
import { FirebaseIdTokenService } from './authentication/firebase-id-token.service';

interface Options {

    body?: unknown,
    params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
}

@Injectable({
    providedIn: 'root'
})
export class AppService {

    protected readonly baseUrl: string = `${environment.baseURL}/api`;

    constructor(protected http: HttpClient, protected fbIdTokenService: FirebaseIdTokenService) {
    }

    private setHeaders(): HttpHeaders {
        return new HttpHeaders().set(
            'Authorization',
            `${this.fbIdTokenService.getIdToken()}`
        );
    }

    httpGet<T>(url: string, options: Options = {}): Observable<T> {
        const header: HttpHeaders = this.setHeaders();
        return this.http.get<T>(url, {
            headers: header,
            params: options.params,
        });
    }

    httpPost<T>(url: string, options: Options = {}): Observable<T> {
        const header: HttpHeaders = this.setHeaders();
        return this.http.post<T>(url, options.body, {
            headers: header,
            params: options.params,
        });
    }

    httpPut<T>(url: string, options: Options = {}): Observable<T> {
        const header: HttpHeaders = this.setHeaders();
        return this.http.put<T>(url, options.body, {
            headers: header,
            params: options.params,
        });
    }

    httpDelete<T>(url: string, options: Options = {}): Observable<T> {
        const header: HttpHeaders = this.setHeaders();
        return this.http.delete<T>(url, {
            headers: header,
            params: options.params,
        });
    }
}
