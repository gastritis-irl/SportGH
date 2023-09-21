import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { FirebaseIdTokenService } from './firebase-id-token.service';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';

export const isLoggedIn: CanActivateFn = (): boolean => {
    if (!!inject(FirebaseIdTokenService).getDecodedIdToken()?.user_id) {
        return true;
    } else {
        inject(Router).navigate(['']);
        return false;
    }
};

export const isAdmin: CanActivateFn = (): boolean => {
    // first add role field to idToken
    // if (!!inject(FirebaseIdTokenService).getDecodedIdToken().role === 'ADMIN') {
    //     return true;
    // }
    return false;
};

export const isProductOwner: CanActivateFn = (route: ActivatedRouteSnapshot,
                                              state: RouterStateSnapshot): boolean => {
    return !!inject(ProductService).getById(route.params['productId']).subscribe({
        next: (product: Product): boolean => {
            return product.userUid === inject(FirebaseIdTokenService).getDecodedIdToken()?.user_id;
        },
        error: (): boolean => {
            return false;
        }
    });
};
