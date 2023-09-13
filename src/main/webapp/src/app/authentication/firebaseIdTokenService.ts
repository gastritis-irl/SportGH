import jwtDecode from 'jwt-decode';
import { IdToken } from './firebaseIdToken.model';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FirebaseIdTokenService {

    getIdToken(): IdToken | null {
        const firebaseIdToken: string | null = sessionStorage.getItem('firebaseIdToken');
        if (firebaseIdToken) {
            return jwtDecode(firebaseIdToken);
        }
        return null;
    }
}
