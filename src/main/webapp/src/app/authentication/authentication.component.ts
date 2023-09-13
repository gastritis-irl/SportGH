import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { User } from '../user/user.model';
import jwtDecode from 'jwt-decode';

interface IdToken {
    iss: string;
    aud: string;
    auth_time: number;
    user_id: string;
    sub: string;
    iat: number;
    exp: number;
    email: string;
    email_verified: boolean;
}

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

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(
        private modalService: NgbModal,
        private userService: UserService,
        private afAuth: AngularFireAuth,
        private toastNotify: ToastrService,
    ) {
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
    }

    ngOnInit(): void {
        const firebaseIdToken: string | null = sessionStorage.getItem('firebaseIdToken');
        if (firebaseIdToken) {
            const decodedIdToken: IdToken = jwtDecode(firebaseIdToken);
            this.loggedInUserEmail = decodedIdToken.email;
        }

        this.afAuth.authState
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((user): void => {
                if (user) {
                    this.loggedInUserEmail = user.email;
                } else {
                    this.loggedInUserEmail = null;
                }
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.ngUnsubscribe.pipe(takeUntil(this.ngUnsubscribe));
        this.closeModal(); // Close any open modal
        sessionStorage.clear();
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
            .catch(error => {
                console.log(error);
                this.toastNotify.warning(`Error logging in`);
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
        }).catch(error => {
            console.log(error);
            this.toastNotify.warning(`Error registering`);
        });
    }
}
