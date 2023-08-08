import { Component, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
    selector: 'sgh-offcanvas',
    templateUrl: './offcanvas.component.html',
})
export class OffcanvasComponent {

    email: string = "";
    password: string = "";
    errorMessage: string = ""; // To display error messages

    constructor(private offcanvasService: NgbOffcanvas, private userService: UserService, private router: Router) {
    }

    openOffcanvas(content: TemplateRef<string>): void {
        this.offcanvasService.open(content, { position: 'start', scroll: true });
    }

    login(): void {
        this.userService.signinWithFirebase(this.email, this.password).then(userObservable => {
            userObservable.subscribe(
                () => {
                    alert('Login successful');
                    this.router.navigate(['/home']); // Navigate to dashboard or other page
                },
                error => {
                    console.error('Login failed', error);
                    alert('Login failed');
                    this.errorMessage = 'Login failed. Please try again.'; // Display error message
                }
            );
        }).catch(error => {
            console.error('Error in Firebase authentication', error);
            alert('Login failed');
            this.errorMessage = 'An error occurred during login. Please try again later.'; // Display error message
        });
    }

    register(): void {
        this.userService.registerWithFirebase(this.email, this.password).then(userObservable => {
            userObservable.subscribe(
                () => {
                    alert('Registration successful');
                    this.router.navigate(['/home']); // Navigate to welcome or other page
                },
                error => {
                    console.error('Registration failed', error);
                    alert('Registration failed');
                    this.errorMessage = 'Registration failed. Please try again.'; // Display error message
                }
            );
        }).catch(error => {
            console.error('Error in Firebase registration', error);
            alert('Registration failed');
            this.errorMessage = 'An error occurred during registration. Please try again later.'; // Display error message
        });
    }
}
