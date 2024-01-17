import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { FirebaseIdTokenService } from './firebase-id-token.service';
import { IdToken } from './firebase-id-token.model';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private afAuth: AngularFireAuth, private router: Router) {
    }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        const token: string | null = FirebaseIdTokenService.getIdToken();
        const idToken: IdToken | null = FirebaseIdTokenService.getDecodedIdToken();
        const currentTimeInSeconds: number = Math.floor(Date.now() / 1000);

        // set token / skip
        if (token && idToken && idToken.exp) {

            // update if it is expired / set if it is valid
            if (idToken.exp < currentTimeInSeconds) {
                return from(this.afAuth.currentUser).pipe(
                    switchMap((user: firebase.User | null) => {
                        if (user) {
                            return from(user.getIdToken()).pipe(
                                switchMap((token: string) => {
                                    FirebaseIdTokenService.setIdToken(token);
                                    const modifiedRequest: HttpRequest<unknown> = request.clone({
                                        setHeaders: {
                                            Authorization: token
                                        }
                                    });
                                    return next.handle(modifiedRequest).pipe(
                                        catchError(err => {
                                            if (err instanceof HttpErrorResponse) {
                                                return this.handleHttpError(err);
                                            } else {
                                                return of(err);
                                            }
                                        })
                                    );
                                })
                            );
                        } else {
                            return next.handle(request).pipe(
                                catchError(err => {
                                    if (err instanceof HttpErrorResponse) {
                                        return this.handleHttpError(err);
                                    } else {
                                        return of(err);
                                    }
                                })
                            );
                        }
                    }),
                    catchError((error) => {
                        console.error('Firebase Token Interceptor Error:', error);
                        return of(error);
                    })
                );
            } else {
                const modifiedRequest: HttpRequest<unknown> = request.clone({
                    setHeaders: {
                        Authorization: token
                    }
                });
                return next.handle(modifiedRequest).pipe(
                    catchError(err => {
                        if (err instanceof HttpErrorResponse) {
                            return this.handleHttpError(err);
                        } else {
                            return of(err);
                        }
                    })
                );
            }
        } else {
            return next.handle(request).pipe(
                catchError(err => {
                    if (err instanceof HttpErrorResponse) {
                        return this.handleHttpError(err);
                    } else {
                        return of(err);
                    }
                })
            );
        }
    }

    private handleHttpError(error: HttpErrorResponse): Observable<unknown> {
        if (error.status === 401 || error.status === 403) {
            this.router.navigate(['/access-denied']);
        } else if (error.status === 404) {
            this.router.navigate(['/not-found']);
        }
        throw error;
    }
}
