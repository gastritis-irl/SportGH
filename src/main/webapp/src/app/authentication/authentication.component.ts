import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { User } from '../user/user.model';
import { FirebaseIdTokenService } from '../auth-and-token/firebase-id-token.service';
import { IdToken } from '../auth-and-token/firebase-id-token.model';

@Component({
    selector: 'sgh-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: [ './authentication.component.scss' ]
})
export class AuthenticationComponent implements OnInit, OnDestroy {

    @ViewChild('loginContent') loginContent!: TemplateRef<string>;

    loggedInUserEmail: string | null = null;

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
        }
    }

    ngOnDestroy(): void {
        sessionStorage.clear();
        indexedDB.deleteDatabase('firebaseLocalStorageDb');
    }

    logout(): void {
        this.afAuth.signOut().then((): void => {
            this.loggedInUserEmail = null;  // Reset the logged-in email
            this.toastNotify.success('Successfully logged out');
        }).catch(error => {
            console.error('Error during logout', error);
            this.toastNotify.warning('Error logging out');
        });
        sessionStorage.clear();
        indexedDB.deleteDatabase('firebaseLocalStorageDb');
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

    login(): void {
        this.userService.signInWithFirebase(this.email, this.password)
            .then((): void => {
                // Use the email directly here before clearing the form
                this.loggedInUserEmail = this.email;

                this.toastNotify.success(`Successfully logged in as ${this.email}`);
                this.closeModal(); // Close the modal
            })
            .catch((error: string): void => {
                this.toastNotify.warning(`Error logging in: ${this.getErrorMessageInfo(error)}`);
            });
    }

    register(): void {
        this.userService.signUpWithFirebase(this.email, this.password).then((userObservable: Observable<User>): void => {
            userObservable.subscribe({
                next: (): void => {
                    // Use the email directly here before clearing the form
                    this.loggedInUserEmail = this.email;

                    this.toastNotify.success('Registration successful');
                    this.closeModal(); // Close the modal
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
