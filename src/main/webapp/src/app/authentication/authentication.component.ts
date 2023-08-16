import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';


@Component({
    selector: 'sgh-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})

export class AuthenticationComponent {

    @ViewChild('loginContent') loginContent!: TemplateRef<string>;

    loggedInUserEmail: string | null = null;

    email: string = '';
    password: string = '';
    errorMessage: string = ''; // To display error messages

    constructor(private modalService: NgbModal, private userService: UserService, private router: Router) {}

    openModal(content: TemplateRef<string>): void {
        this.modalService.open(content, { centered: true, scrollable: true, animation: true });
    }

    login(): void {
        this.userService.signinWithFirebase(this.email, this.password).then(userObservable => {
            userObservable.subscribe({
                next: () => {
                    this.loggedInUserEmail = this.email; // Store the logged-in email
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
                    alert('Registration successful');
                    this.openModal(this.loginContent);
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
