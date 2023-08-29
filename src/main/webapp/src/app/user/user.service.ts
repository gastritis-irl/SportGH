import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { User } from './user.model';
import { getIdToken } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';



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

    async signinWithFirebase(email: string, password: string): Promise<Observable<User>> {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);  
        const idToken = await getIdToken(userCredential.user!);
        sessionStorage.setItem('firebaseIdToken', idToken);
        const url: string = `${this.baseUrl}/auth/login`;
        return this.http.post<User>(url, { idToken, password });
    }

    async registerWithFirebase(email: string, password: string): Promise<Observable<User>> {
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);  
        const idToken = await getIdToken(userCredential.user!);
        sessionStorage.setItem('firebaseIdToken', idToken);
        const url: string = `${this.baseUrl}/auth/signup`;
        return this.http.post<User>(url, { email, idToken, password });
    }
}
