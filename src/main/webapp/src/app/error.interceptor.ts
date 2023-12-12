import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {Router} from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
        catchError(err => {
            console.log(err);
            if (err.error.status === 401 || err.error.status === 403) {
              this.router.navigate(['/access-denied']);
            } else if (err.error.status === 404) {
              this.router.navigate(['/not-found']);
            }
            throw err;
        })
    );
  }
}
