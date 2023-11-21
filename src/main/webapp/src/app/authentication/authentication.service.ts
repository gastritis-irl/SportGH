import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase/compat';
import AuthProvider = firebase.auth.AuthProvider;

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        public afAuth: AngularFireAuth,
        private toastr: ToastrService
    ) {
    }

    // Sign in with Google
    GoogleAuth() {
        return this.AuthLogin(new GoogleAuthProvider());
    }

    // Auth logic to run auth providers
    async AuthLogin(provider: AuthProvider) {
        try {
            await this.afAuth.signInWithPopup(provider).then();
            this.toastr.success("Login successful")
        } catch (error) {
            this.toastr.error('Something went wrong!');
        }
    }
}
