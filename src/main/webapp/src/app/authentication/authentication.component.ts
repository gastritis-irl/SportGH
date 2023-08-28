import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'sgh-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnDestroy {

    emailControl = new FormControl('', [
        Validators.required,
        Validators.email
    ]);
    passwordControl = new FormControl('', [
        Validators.required,
        Validators.minLength(8)
    ]);

    @ViewChild('loginContent') loginContent!: TemplateRef<string>;

    loggedInUserEmail: string | null = null;
    email: string = '';
    password: string = '';
    errorMessage: string = '';

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private modalService: NgbModal,
        private userService: UserService,
        private router: Router,
        private afAuth: AngularFireAuth
    ) { }
    
    logout(): void {
        this.afAuth.signOut().then(() => {
            this.loggedInUserEmail = null;  // Reset the logged-in email
            alert('Logged out successfully');
            this.router.navigate(['/home']);  // Redirect to home after logout
        }).catch(error => {
            console.error('Error during logout', error);
            alert('Error during logout. Please try again.');
        });
    }

    ngOnInit(): void {
        this.afAuth.authState
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(user => {
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
        // this.ngUnsubscribe.unsubscribe();
        this.ngUnsubscribe.pipe(takeUntil(this.ngUnsubscribe));
        this.closeModal(); // Close any open modal
    }

    openModal(content: TemplateRef<string>): void {
        this.closeModal(); // Close any open modal
        this.modalService.open(content, { centered: true, scrollable: true, animation: true });
    }
    
    closeModal(): void {
        this.modalService.dismissAll();
    }

    login(): void {
        this.userService.signinWithFirebase(this.email, this.password).then(userObservable => {
            userObservable.subscribe({
                next: () => {
                    // Use the email directly here before clearing the form
                    this.loggedInUserEmail = this.email;

                    // Clear the form
                    this.email = '';
                    this.password = '';

                    this.closeModal(); // Close the modal
                    this.router.navigate(['/home']);
                },
                error: (error) => {
                    console.error('Login failed', error);
                    alert('Login failed' + error.message);
                    this.errorMessage = 'Login failed. Please try again.';
                }
            });
        }).catch(error => {
            console.error('Error in Firebase authentication', error);
            alert('Login failed' + error.message);
            this.errorMessage = 'An error occurred during login. Please try again later.';
        });
    }

    register(): void {
        this.userService.registerWithFirebase(this.email, this.password).then(userObservable => {
            userObservable.subscribe({
                next: () => {

                    // Use the email directly here before clearing the form
                    this.loggedInUserEmail = this.email;

                    // Clear the form
                    this.email = '';
                    this.password = '';
                    alert('Registration successful. You are now logged in.');
                    this.loggedInUserEmail = this.email; // Store the logged-in email
                    this.closeModal(); // Close the modal
                    this.router.navigate(['/home']); // Navigate to home page
                },
                error: (error) => {
                    console.error('Registration failed', error);
                    alert('Registration failed' + error.message);
                    this.errorMessage = 'Registration failed. Please try again.';
                }
            });
        }).catch(error => {
            console.error('Error in Firebase registration', error);
            alert('Registration failed.\n' + error.message);
            this.errorMessage = 'An error occurred during registration. Please try again later.';
        });
    }
}
