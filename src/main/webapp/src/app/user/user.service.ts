import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppService} from "../app.service";
import {User} from "./user.model";
import {initializeApp} from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, getIdToken, signInWithEmailAndPassword} from "firebase/auth";
import {environment} from '../environment';


const firebaseApp = initializeApp(environment.firebaseConfig);  // make sure to replace firebaseConfig with your actual config
const auth = getAuth(firebaseApp);


@Injectable({
    providedIn: 'root'
})
export class UserService extends AppService {

    constructor(http: HttpClient) {
        super(http);
    }

    getAll(): Observable<User[]> {
        const url: string = `${this.baseUrl}/users`;
        return this.http.get<User[]>(url);
    }

    signinWithFirebase(email: string, password: string): Promise<Observable<User>> {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // The user is signed in
                const user = userCredential.user;
                // Get the user's ID token
                return getIdToken(user).then((idToken) => {
                    // Save the ID token for later use
                    localStorage.setItem('firebaseIdToken', idToken);
                    // Send the ID token to your backend
                    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + idToken);
                    const url: string = `${this.baseUrl}/auth/login`;
                    return this.http.post<User>(url, { email, password }, { headers: headers });
                });
            });
    }

    registerWithFirebase(email: string, password: string): Promise<Observable<User>> {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // The user is signed up
                const user = userCredential.user;
                // Get the user's ID token
                return getIdToken(user).then((idToken) => {
                    // Save the ID token for later use
                    localStorage.setItem('firebaseIdToken', idToken);
                    // Send the ID token to your backend
                    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + idToken);
                    const url: string = `${this.baseUrl}/auth/signup`;
                    return this.http.post<User>(url, { email, password }, { headers: headers });
                });
            });

    }
}
