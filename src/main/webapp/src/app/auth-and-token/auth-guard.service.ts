import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FirebaseIdTokenService } from './firebase-id-token.service';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';
import { first, map, Observable, tap } from 'rxjs';

function check(statement: boolean, router?: Router): boolean {
    if (statement) {
        return true;
    } else {
        (router ?? inject(Router)).navigate(['/']);
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
    const router: Router = inject(Router);
    return inject(ProductService).getById(route.params['productId'])
        .pipe(
            first(),
            map((product: Product) => product && product.userId === FirebaseIdTokenService.getDecodedIdToken()?.userId),
            tap((answer: boolean) =>
                check(answer, router)
            )
        );
};
