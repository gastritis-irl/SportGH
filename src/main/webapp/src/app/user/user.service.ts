import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { User } from './user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { getIdToken } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class UserService extends AppService {

    constructor(private afAuth: AngularFireAuth, http: HttpClient) {
        super(http);
    }

    getByUid(uid: string): Observable<User> {
        const url: string = `${this.baseUrl}/users/${uid}`;
        return this.httpGet<User>(url);
    }

    update(userId: number, user: User): Observable<User> {
        const url: string = `${this.baseUrl}/users/${userId}`;
        return this.httpPut<User>(url, { body: user });
    }

    async signInWithFirebase(email: string, password: string): Promise<Observable<{ idToken: string }>> {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        const idToken: string = await getIdToken(userCredential.user!);
        sessionStorage.setItem('firebaseIdToken', idToken);
        const url: string = `${this.baseUrl}/auth/login`;
        return this.http.post<{ idToken: string }>(url, { email, idToken });
    }

    async signUpWithFirebase(email: string, password: string): Promise<Observable<{ idToken: string }>> {
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
        const idToken: string = await getIdToken(userCredential.user!);
        sessionStorage.setItem('firebaseIdToken', idToken);
        const url: string = `${this.baseUrl}/auth/signup`;
        return this.http.post<{ idToken: string }>(url, { email, idToken });
    }

    async signInForCustomClaims(customToken: string): Promise<void> {
        const userCredentials = await this.afAuth.signInWithCustomToken(customToken);
        const idToken: string = await getIdToken(userCredentials.user!);
        sessionStorage.setItem('firebaseIdToken', idToken);
    }
}
