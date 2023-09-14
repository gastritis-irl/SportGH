import jwtDecode from 'jwt-decode';
import { IdToken } from './firebase-id-token.model';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FirebaseIdTokenService {

    getIdToken(): string | null {
        return sessionStorage.getItem('firebaseIdToken');
    }

    getDecodedIdToken(): IdToken | null {
        const firebaseIdToken: string | null = sessionStorage.getItem('firebaseIdToken');
        if (firebaseIdToken) {
            return jwtDecode(firebaseIdToken);
        }
        return null;
    }
}
