import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { FirebaseIdTokenService } from './firebase-id-token.service';
import { IdToken } from './firebase-id-token.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private afAuth: AngularFireAuth) {
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
                                    return next.handle(modifiedRequest);
                                })
                            );
                        } else {
                            return next.handle(request);
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
                return next.handle(modifiedRequest);
            }
        } else {
            return next.handle(request);
        }
    }
}
