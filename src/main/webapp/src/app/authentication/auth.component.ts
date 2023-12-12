import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FirebaseIdTokenService } from '../auth-and-token/firebase-id-token.service';
import { IdToken } from '../auth-and-token/firebase-id-token.model';
import firebase from 'firebase/compat';
import { GoogleAuthProvider } from '@angular/fire/auth';

@Component({
    selector: 'sgh-authentication',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

    @ViewChild('loginContent') loginContent!: TemplateRef<string>;
    @Input() changePassword: boolean = false;

    loggedInUserEmail: string | null = null;
    loggedInUserName: string | null = null;
    loggedInUserFirebaseId: string | null = null;
    showDropdown: boolean = false;


    email: string = '';
    password: string = '';

    constructor(
        private modalService: NgbModal,
        private userService: UserService,
        private afAuth: AngularFireAuth,
        private toastNotify: ToastrService,
    ) {
    }

    ngOnInit(): void {
        const idToken: IdToken | null = FirebaseIdTokenService.getDecodedIdToken();
        if (idToken) {
            this.loggedInUserEmail = idToken.email;
            this.loggedInUserName = this.loggedInUserEmail;
            this.loggedInUserFirebaseId = idToken.user_id;
        }
    }

    ngOnDestroy(): void {
        sessionStorage.clear();
        indexedDB.deleteDatabase('firebaseLocalStorageDb');
    }

    logout(): void {
        this.afAuth.signOut().then((): void => {
            this.loggedInUserEmail = null;  // Reset the logged-in email
            this.loggedInUserName = this.loggedInUserEmail;
            this.loggedInUserFirebaseId = null;
            this.toastNotify.success('Successfully logged out');
        }).catch(error => {
            console.error('Error during logout', error);
            this.toastNotify.warning('Error logging out');
        });
        sessionStorage.clear();
        indexedDB.deleteDatabase('firebaseLocalStorageDb');
        window.location.reload();
    }

    toggleDropdown(): void {
        this.showDropdown = !this.showDropdown;
    }

    openModal(content: TemplateRef<string>): void {
        this.closeModal(); // Close any open modal
        this.modalService.open(content, { centered: true, scrollable: true, animation: true });
    }

    closeModal(): void {
        this.modalService.dismissAll();

        // Clear the form
        this.email = '';
        this.password = '';
    }

    async requestPasswordReset(_email: string): Promise<void> {
        await this.afAuth.sendPasswordResetEmail(_email).then((): void => {
            this.toastNotify.success(`Password reset email sent to ${_email}`);
        }).catch((): void => {
            this.toastNotify.success(`Password reset email sent to ${_email}`);
        });
    }

    async resetPassword(): Promise<void> {
        if (!this.changePassword) {
            await this.requestPasswordReset(this.email);
            this.closeModal();
        } else {
            const user = await this.afAuth.currentUser;
            const email: string | null | undefined = user?.email;
            if (email) {
                await this.requestPasswordReset(email);
            }
        }
    }

    async initGoogleAuth(): Promise<GoogleAuthProvider> {
        this.closeModal();
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        return provider;
    }

    async googleLogin() {
        try {
            const provider = await this.initGoogleAuth();
            await this.afAuth.signInWithPopup(provider).then(
                async (result: firebase.auth.UserCredential) => {
                    if (result.credential == null) {
                        console.log('credential is null');
                        return;
                    }
                    const credential = result

                    if (credential.user) {
                        const idToken = await credential.user.getIdToken(); // Get ID token

                        await this.handleGoogleLogin(credential.user, idToken);
                    } else {
                        this.toastNotify.error('No user information available after login redirect.');
                    }
                },
                (error) => {
                    console.log('error', error);
                    this.toastNotify.error('Google login failed', error);
                    return;
                }
            );
        } catch (error) {
            console.error('Error during Google Login', error);
            this.toastNotify.error('Error during Google Login');
        }
    }


    async handleGoogleLogin(user: firebase.User | null, idToken: string) {
        if (user == null || user.email == null) {
            this.toastNotify.error('Something went wrong during GAuth!');
            return;
        }

        this.userService.signInWithGoogle(idToken, user.email!).then((respObservable: Observable<{
            idToken: string
        }>): void => {
            respObservable.subscribe({
                next: (idTokenWithCustomFields: { idToken: string }): void => {
                    this.userService.signInForCustomClaims(idTokenWithCustomFields.idToken)
                        .then((): void => {
                            this.loggedInUserEmail = user.email;
                            this.loggedInUserName = this.loggedInUserEmail;
                            const idToken: IdToken | null = FirebaseIdTokenService.getDecodedIdToken();
                            if (idToken) {
                                this.loggedInUserFirebaseId = idToken?.user_id;
                            }

                            this.toastNotify.success(`Successfully logged in as ${user.email}`);
                        }).catch((error): void => {
                        console.log(error);
                        this.toastNotify.warning(`Error logging in`);
                    });
                },
                error: (error): void => {
                    console.log(error);
                    this.toastNotify.warning(`Error logging in`);
                }
            });
        }).catch((error: string): void => {
            this.toastNotify.warning(`Error logging in: ${this.getErrorMessageInfo(error)}`);
        });
    }

    async googleSignup() {
        try {

            const provider = await this.initGoogleAuth();
            await this.afAuth.signInWithPopup(provider).then(
                async (result: firebase.auth.UserCredential) => {
                    if (result.credential == null) {
                        console.log('credential is null');
                        this.toastNotify.error('Error during Google Signup');
                        return;
                    }
                    const credential = result

                    if (credential.user) {
                        const idToken = await credential.user.getIdToken(); // Get ID token

                        // Now use this idToken for your login logic
                        await this.handleGoogleSignup(credential.user, idToken);
                    } else {
                        this.toastNotify.error('No user information available after signup redirect.');
                    }
                },
                (error) => {
                    console.log('error', error);
                    this.toastNotify.error('Error during Google Signup');
                    return;
                }
            );
        } catch (error) {
            console.error('Error during Google Signup', error);
            this.toastNotify.error('Error during Google Signup');
        }
    }

    async handleGoogleSignup(user: firebase.User | null, idToken: string) {
        if (user == null || user.email == null) {
            this.toastNotify.error('Something went wrong during Google authentication!');
            return;
        }

        this.userService.signUpWithGoogle(idToken, user.email!).then((respObservable: Observable<{
            idToken: string
        }>): void => {
            respObservable.subscribe({
                next: (idTokenWithCustomFields: { idToken: string }): void => {
                    this.userService.signInForCustomClaims(idTokenWithCustomFields.idToken)
                        .then((): void => {
                            // Use the email directly here before clearing the form
                            this.loggedInUserEmail = user.email;
                            this.loggedInUserName = this.loggedInUserEmail;
                            const idToken: IdToken | null = FirebaseIdTokenService.getDecodedIdToken();
                            if (idToken) {
                                this.loggedInUserFirebaseId = idToken?.user_id;
                            }

                            this.toastNotify.success(`Successfully signed up as ${user.email}`);
                        }).catch((error): void => {
                        console.log(error);
                        this.toastNotify.warning(`Error signing up`);
                    });
                },
                error: (error): void => {
                    console.log(error);
                    this.toastNotify.warning(`Error signing up`);
                }
            });
        }).catch((error: string): void => {
            this.toastNotify.warning(`Error signing up: ${this.getErrorMessageInfo(error)}`);
        });
    }


    login(): void {
        this.userService.signInWithFirebase(this.email, this.password)
            .then((respObservable: Observable<{ idToken: string }>): void => {
                respObservable.subscribe({
                    next: (idTokenWithCustomFields: { idToken: string }): void => {
                        this.userService.signInForCustomClaims(idTokenWithCustomFields.idToken)
                            .then((): void => {
                                // Use the email directly here before clearing the form
                                this.loggedInUserEmail = this.email;
                                this.loggedInUserName = this.loggedInUserEmail;
                                const idToken: IdToken | null = FirebaseIdTokenService.getDecodedIdToken();
                                if (idToken) {
                                    this.loggedInUserFirebaseId = idToken?.user_id;
                                }

                                this.toastNotify.success(`Successfully logged in as ${this.email}`);
                                this.closeModal(); // Close the modal
                            }).catch((error): void => {
                            console.log(error);
                            this.toastNotify.warning(`Error logging in`);
                        });
                    },
                    error: (error): void => {
                        console.log(error);
                        this.toastNotify.warning(`Error logging in`);
                    }
                });
            }).catch((error: string): void => {
            this.toastNotify.warning(`Error logging in: ${this.getErrorMessageInfo(error)}`);
        });
    }

    register(): void {
        this.userService.signUpWithFirebase(this.email, this.password)
            .then((respObservable: Observable<{ idToken: string }>): void => {
                respObservable.subscribe({
                    next: (idTokenWithCustomFields: { idToken: string }): void => {
                        this.userService.signInForCustomClaims(idTokenWithCustomFields.idToken)
                            .then((): void => {
                                // Use the email directly here before clearing the form
                                this.loggedInUserEmail = this.email;
                                this.loggedInUserName = this.loggedInUserEmail;

                                const idToken: IdToken | null = FirebaseIdTokenService.getDecodedIdToken();
                                if (idToken) {
                                    this.loggedInUserFirebaseId = idToken?.user_id;
                                }

                                this.toastNotify.success('Registration successful');
                                this.closeModal(); // Close the modal
                            }).catch((error): void => {
                            console.log(error);
                            this.toastNotify.warning(`Error logging in`);
                        });
                    },
                    error: (error): void => {
                        console.log(error);
                        this.toastNotify.warning(`Error registering`);
                    }
                });
            }).catch((error: string): void => {
            this.toastNotify.warning(`Error registering: ${this.getErrorMessageInfo(error)}`);
        });
    }

    getErrorMessageInfo(error: string): string {
        return (String(error)).split(':')[2].split('(')[0];
    }
}
