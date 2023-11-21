import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        public afAuth: AngularFireAuth,
        private toastr: ToastrService
    ) {}
    // Sign in with Google
    GoogleAuth() {
        return this.AuthLogin(new GoogleAuthProvider());
    }
    // Auth logic to run auth providers
    async AuthLogin(provider : GoogleAuthProvider){
        try {
            const result = await this.afAuth
                .signInWithPopup(provider);
            this.toastr.success('You have been successfully logged in!');
        } catch (error) {
            this.toastr.error('Something went wrong!');
        }
    }
}
