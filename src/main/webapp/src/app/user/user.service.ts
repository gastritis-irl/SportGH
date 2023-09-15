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

    constructor(private afAuth: AngularFireAuth, http: HttpClient,) {
        super(http);
    }

    getAll(): Observable<User[]> {
        const url: string = `${this.baseUrl}/users`;
        return this.http.get<User[]>(url);
    }

    getById(userId: number): Observable<User> {
        const url: string = `${this.baseUrl}/users/${userId}`;
        return this.http.get<User>(url);
    }

    async signInWithFirebase(email: string, password: string): Promise<void> {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        const idToken: string = await getIdToken(userCredential.user!);
        sessionStorage.setItem('firebaseIdToken', idToken);
    }

    async signUpWithFirebase(email: string, password: string): Promise<Observable<User>> {
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
        const idToken: string = await getIdToken(userCredential.user!);
        sessionStorage.setItem('firebaseIdToken', idToken);
        const url: string = `${this.baseUrl}/auth/signup`;
        return this.http.post<User>(url, { email, idToken });
    }
}
