import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FirebaseIdTokenService } from './firebase-id-token.service';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';

export const isLoggedIn: CanActivateFn = (): boolean => {
    if (FirebaseIdTokenService.getDecodedIdToken()?.user_id) {
        return true;
    } else {
        inject(Router).navigate(['']);
        return false;
    }
};

export const isCurrentUser: CanActivateFn = (route: ActivatedRouteSnapshot): boolean => {
    return FirebaseIdTokenService.getDecodedIdToken()?.user_id === route.params['uid'];
};

export const isAdmin: CanActivateFn = (): boolean => {
    return FirebaseIdTokenService.getDecodedIdToken()?.role === 'ADMIN';
};

export const isProductOwner: CanActivateFn = (route: ActivatedRouteSnapshot): boolean => {
    return !!inject(ProductService).getById(route.params['productId']).subscribe({
        next: (product: Product): boolean => {
            return product.userId === FirebaseIdTokenService.getDecodedIdToken()?.userId;
        },
        error: (): boolean => {
            return false;
        }
    });
};
