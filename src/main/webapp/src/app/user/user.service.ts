import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { User } from './user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { getIdToken } from '@angular/fire/auth';
import { FirebaseIdTokenService } from '../auth-and-token/firebase-id-token.service';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;

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
        return this.firebaseAuthProcedure(userCredential, email);
    }

    async signUpWithFirebase(email: string, password: string): Promise<Observable<{ idToken: string }>> {
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
        return this.firebaseAuthProcedure(userCredential, email);
    }

    async signInWithGoogle(idToken: string, email: string): Promise<Observable<{ idToken: string }>> {
        sessionStorage.setItem('firebaseIdToken', idToken);
        return this.makeAuthRequest(email, idToken, '/auth/login');
    }

    async signUpWithGoogle(idToken: string, email: string): Promise<Observable<{ idToken: string }>> {
        sessionStorage.setItem('firebaseIdToken', idToken);
        return this.makeAuthRequest(email, idToken, '/auth/signup');
    }

    async signInForCustomClaims(customToken: string): Promise<void> {
        const userCredentials = await this.afAuth.signInWithCustomToken(customToken);
        const idToken: string = await getIdToken(userCredentials.user!);
        FirebaseIdTokenService.setIdToken(idToken);
    }

    private async firebaseAuthProcedure(userCredential: UserCredential, email: string): Promise<Observable<{ idToken: string }>> {
        const idToken: string = await getIdToken(userCredential.user!);
        FirebaseIdTokenService.setIdToken(idToken);
        const endpoint = userCredential.additionalUserInfo!.isNewUser ? '/auth/signup' : '/auth/login';
        return this.makeAuthRequest(email, idToken, endpoint);
    }

    private makeAuthRequest(email: string, idToken: string, endpoint: string): Observable<{ idToken: string }> {
        const url: string = `${this.baseUrl}${endpoint}`;
        return this.http.post<{ idToken: string }>(url, { email, idToken });
    }
}
