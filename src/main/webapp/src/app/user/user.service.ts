import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { User } from './user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { getIdToken } from '@angular/fire/auth';
import { FirebaseIdTokenService } from '../auth-and-token/firebase-id-token.service';


@Injectable({
    providedIn: 'root'
})
export class UserService extends AppService {

    constructor(private afAuth: AngularFireAuth, http: HttpClient, fbIdTokenService: FirebaseIdTokenService) {
        super(http, fbIdTokenService);
    }

    getByUid(uid: string): Observable<User> {
        const url: string = `${this.baseUrl}/users/${uid}`;
        return this.httpGet<User>(url);
    }

    update(userId: number, user: User): Observable<User> {
        const url: string = `${this.baseUrl}/users/${userId}`;
        return this.httpPut<User>(url, { body: user });
    }

    async signInWithFirebase(email: string, password: string): Promise<Observable<string>> {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        const idToken: string = await getIdToken(userCredential.user!);
        sessionStorage.setItem('firebaseIdToken', idToken);
        const url: string = `${this.baseUrl}/auth/login`;
        return this.http.post<string>(url, { email, idToken });
    }

    async signUpWithFirebase(email: string, password: string): Promise<Observable<string>> {
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
        const idToken: string = await getIdToken(userCredential.user!);
        sessionStorage.setItem('firebaseIdToken', idToken);
        const url: string = `${this.baseUrl}/auth/signup`;
        return this.http.post<string>(url, { email, idToken });
    }
}
