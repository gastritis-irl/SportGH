import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FirebaseIdTokenService } from './firebase-id-token.service';
import { ProductService } from '../product/product.service';
import { first, map, Observable, tap } from 'rxjs';
import { IdToken } from './firebase-id-token.model';

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
    const uid: string | undefined = route.params['uid'];
    const token: IdToken | null = FirebaseIdTokenService.getDecodedIdToken();

    return (token && uid === 'profile') || uid === token?.user_id || token?.role === 'ADMIN';
};

export const isAdmin: CanActivateFn = (): boolean => {
    return check(FirebaseIdTokenService.getDecodedIdToken()?.role === 'ADMIN');
};

export const isProductOwner: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
    const router: Router = inject(Router);
    return inject(ProductService).getOwnerIdById(route.params['productId'])
        .pipe(
            first(),
            map((ownerId: number | null) => ownerId !== null && ownerId === FirebaseIdTokenService.getDecodedIdToken()?.userId),
            tap((answer: boolean) =>
                check(answer, router)
            )
        );
};
