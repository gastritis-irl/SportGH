import jwtDecode from 'jwt-decode';
import { IdToken } from './firebaseIdToken.model';

export class FirebaseIdTokenService {

    getIdToken(): IdToken | null {
        const firebaseIdToken: string | null = sessionStorage.getItem('firebaseIdToken');
        if (firebaseIdToken) {
            return jwtDecode(firebaseIdToken);
        }
        return null;
    }
}
