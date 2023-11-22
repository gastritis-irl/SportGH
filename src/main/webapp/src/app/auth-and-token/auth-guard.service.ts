import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FirebaseIdTokenService } from './firebase-id-token.service';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';
import { Observable, Subscriber } from 'rxjs';

function check(statement: boolean): boolean {
    if (statement) {
        return true;
    } else {
        inject(Router).navigate(['/']).then((): void => {
        });
        return false;
    }
}

export const isLoggedIn: CanActivateFn = (): boolean => {
    return check(FirebaseIdTokenService.getDecodedIdToken()?.user_id !== undefined);
};

export const isCurrentUser: CanActivateFn = (route: ActivatedRouteSnapshot): boolean => {
    return check(FirebaseIdTokenService.getDecodedIdToken()?.user_id === route.params['uid']);
};

export const isAdmin: CanActivateFn = (): boolean => {
    return check(FirebaseIdTokenService.getDecodedIdToken()?.role === 'ADMIN');
};

export const isProductOwner: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
    return new Observable<boolean>((observer: Subscriber<boolean>): void => {
        !!inject(ProductService).getById(route.params['productId']).subscribe({
                next: (product: Product): void => {
                    const isProductValid: boolean = product && product.userId === FirebaseIdTokenService.getDecodedIdToken()?.userId;

                    console.log(isProductValid);
                    observer.next(isProductValid);
                    observer.complete();
                },
                error:
                    (error): void => {
                        console.error('Error fetching product:', error);
                        observer.next(check(false));
                        observer.complete();
                    }
            }
        );
    });
};
