import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './environment';
import { Observable } from 'rxjs';
import { FirebaseIdTokenService } from './authentication/firebase-id-token.service';

interface Options {

    body?: unknown,
    params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
    responseType?: 'json' | undefined,
}

@Injectable({
    providedIn: 'root'
})
export class AppService {

    protected readonly baseUrl: string = `${environment.baseURL}/api`;

    constructor(protected http: HttpClient, protected fbIdTokenService: FirebaseIdTokenService) {
    }

    protected setHeaders(): HttpHeaders {
        const idToken: string | null = this.fbIdTokenService.getIdToken();
        if (idToken == null || idToken == '') {
            return new HttpHeaders();
        } else {
            return new HttpHeaders().set('Authorization', idToken);
        }
    }

    httpGet<T>(url: string, options: Options = {}): Observable<T> {
        const header: HttpHeaders = this.setHeaders();
        return this.http.get<T>(url, {
            headers: header,
            params: options.params,
            responseType: options.responseType
        });
    }

    httpPost<T>(url: string, options: Options = {}): Observable<T> {
        const header: HttpHeaders = this.setHeaders();
        return this.http.post<T>(url, options.body, {
            headers: header,
            params: options.params,
            responseType: options.responseType
        });
    }

    httpPut<T>(url: string, options: Options = {}): Observable<T> {
        const header: HttpHeaders = this.setHeaders();
        return this.http.put<T>(url, options.body, {
            headers: header,
            params: options.params,
            responseType: options.responseType
        });
    }

    httpDelete<T>(url: string, options: Options = {}): Observable<T> {
        const header: HttpHeaders = this.setHeaders();
        return this.http.delete<T>(url, {
            headers: header,
            params: options.params,
            responseType: options.responseType
        });
    }
}
