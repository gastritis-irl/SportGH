import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, switchMap } from 'rxjs';
import { User } from '../user/user.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { UserService } from '../user/user.service';
import { getIdToken } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    user$: Observable<User | undefined | null>;

    constructor(
        public afAuth: AngularFireAuth,
        private toastr: ToastrService,
        private router: Router,
        private afs: AngularFirestore,
        private userService: UserService,
    ) {
        // Get the auth state, then fetch the Firestore user document or return null
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                // Logged in
                if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    // Logged out
                    return of(null);
                }
            })
        );
    }

    async googleSignin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        const credential = await this.afAuth.signInWithPopup(provider);
        const idToken: string = await getIdToken(credential.user!);
        return this.updateUserData(credential.user, idToken);
    }


    private updateUserData(user: firebase.User | null, idToken: string) {

        if (user == null || user.email == null) {
            this.toastr.error('Something went wrong during GAuth!');
            return;
        }

        // Sets user data to firestore on login
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);


        const data: User = {
            firebaseUid: user.uid,
            email: user.email,
            username: user?.displayName ? user.displayName : user.email,
            imageId: 0,
        };

        this.userService.getByUid(user.uid).subscribe({
            next: (user: User): void => {
                if (user.id) {
                    data.id = user.id;
                    this.userService.signInWithGoogle(idToken, user.email!).then(() => {
                        this.toastr.success(`Successfully logged in as ${user.email}`);
                    }).catch(e => {
                        this.toastr.error('Error logging in');
                        console.error(e);
                    });
                } else {
                    this.userService.signUpWithGoogle(idToken, user.email!).then(() => {
                        this.toastr.success(`Successfully registered into the system as ${user.email}`);
                    }).catch(e => {
                        this.toastr.error('Error registering');
                        console.error(e);
                    });
                }
                this.toastr.success('Successfully logged in');
                this.router.navigate(['/']).then(() => {
                        this.toastr.info('Redirecting to home page');
                    }
                );
            },
            error: (error): void => {
                console.error(error);
                this.toastr.error(`Error fetching data`);
            }
        });


        return userRef.set(data, { merge: true });

    }
}
