import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FirebaseIdTokenService } from '../auth-and-token/firebase-id-token.service';
import { IdToken } from '../auth-and-token/firebase-id-token.model';

@Component({
    selector: 'sgh-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit, OnDestroy {

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
        private firebaseIdTokenService: FirebaseIdTokenService,
    ) {
    }

    ngOnInit(): void {
        const idToken: IdToken | null = this.firebaseIdTokenService.getDecodedIdToken();
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

    async resetPassword(): Promise<void> {
        this.afAuth.sendPasswordResetEmail(this.email).then((): void => {
            this.toastNotify.success(`Password reset email sent to ${this.email}`);
        }).catch((error): void => {
            this.toastNotify.warning(`Error sending password reset email: ${this.getErrorMessageInfo(error)}`);
        });
        this.closeModal()
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
                                const idToken: IdToken | null = this.firebaseIdTokenService.getDecodedIdToken();
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

                                const idToken: IdToken | null = this.firebaseIdTokenService.getDecodedIdToken();
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
