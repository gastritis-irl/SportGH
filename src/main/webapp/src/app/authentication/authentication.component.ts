import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'sgh-authentication',
    templateUrl: './authentication.component.html',
})

export class AuthenticationComponent {

    @ViewChild('loginContent') loginContent!: TemplateRef<string>;

    loggedInUserEmail: string | null = null;

    email: string = '';
    password: string = '';
    errorMessage: string = ''; // To display error messages
    isOffcanvasOpen: boolean = false;

    constructor(private offcanvasService: NgbOffcanvas, private userService: UserService, private router: Router) {
    }

    openOffcanvas(content: TemplateRef<string>): void {
        this.offcanvasService.open(content, { position: 'start', scroll: true });
        this.isOffcanvasOpen = true;
    }

    closeOffcanvas(): void {
        if (this.isOffcanvasOpen) {
            this.offcanvasService.dismiss();
            this.isOffcanvasOpen = false;
        }
    }

    login(): void {
    this.userService.signinWithFirebase(this.email, this.password).then(userObservable => {
        userObservable.subscribe(
            () => {
                this.loggedInUserEmail = this.email; // Store the logged-in email
                this.closeOffcanvas();
                this.router.navigate(['/home']);
            },
            error => {
                console.error('Login failed', error);
                alert('Login failed' + error.message);
                this.errorMessage = 'Login failed. Please try again.';
            }
        );
    }).catch(error => {
        console.error('Error in Firebase authentication', error);
        alert('Login failed' + error.message);
        this.errorMessage = 'An error occurred during login. Please try again later.';
    });
}


    register(): void {
        this.userService.registerWithFirebase(this.email, this.password).then(userObservable => {
        userObservable.subscribe(
            () => {
                alert('Registration successful');
                this.openOffcanvas(this.loginContent);
            },
            error => {
                console.error('Registration failed', error);
                alert('Registration failed' + error.message);
                this.errorMessage = 'Registration failed. Please try again.';
            }
        );
        }).catch(error => {
            console.error('Error in Firebase registration', error);
            alert('Registration failed.\n' + error.message);
            this.errorMessage = 'An error occurred during registration. Please try again later.';
        });
    }
}
