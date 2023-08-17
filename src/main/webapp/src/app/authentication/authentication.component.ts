import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'sgh-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.scss'],
})

export class AuthenticationComponent {

    @ViewChild('loginContent') loginContent!: TemplateRef<string>;

    loggedInUserEmail: string | null = null;

    email: string = '';
    password: string = '';
    isOffcanvasOpen: boolean = false;

    constructor(
        private offcanvasService: NgbOffcanvas,
        private userService: UserService,
        private router: Router,
        private toastNotify: ToastrService,
    ) {
    }

    openOffcanvas(content: TemplateRef<string>): void {
        this.offcanvasService.open(content, {position: 'start', scroll: true});
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
            userObservable.subscribe({
                next: (): void => {
                    this.loggedInUserEmail = this.email; // Store the logged-in email
                    this.closeOffcanvas();
                    this.router.navigate(['/'])
                        .then((): void => {
                            this.toastNotify.success(`Successfully logged in as ${this.email}`);
                        })
                        .catch((): void => {
                            this.toastNotify.error('Error redirecting to home page.');
                        });
                },
                error: (error): void => {
                    console.error(`Login failed: ${error}`);
                    this.toastNotify.error(`Login failed ${error.message}`);
                }
            });
        }).catch(error => {
            console.error(`Error in Firebase authentication ${error}`);
            this.toastNotify.error(`Login failed ${error.message}`);
        });
    }

    register(): void {
        this.userService.registerWithFirebase(this.email, this.password).then(userObservable => {
            userObservable.subscribe({
                next: (): void => {
                    this.toastNotify.success('Registration successful');
                    this.openOffcanvas(this.loginContent);
                },
                error: (error): void => {
                    console.error(`Registration failed ${error}`);
                    this.toastNotify.error(`Registration failed ${error.message}`);
                }
            });
        }).catch(error => {
            console.error(`Error in Firebase registration ${error}`);
            this.toastNotify.error(`Registration failed.\n${error.message}`);
        });
    }

}
