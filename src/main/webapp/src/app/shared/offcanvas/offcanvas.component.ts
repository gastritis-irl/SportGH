import { Component, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../user/user.service';
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'sgh-offcanvas',
    standalone: true,
    templateUrl: './offcanvas.component.html',
    imports: [
        FormsModule
    ]
})
export class OffcanvasComponent {

    email: string= "";
    password: string = "";

    constructor(private offcanvasService: NgbOffcanvas, private userService: UserService) {
    }

    openOffcanvas(content: TemplateRef<string>): void {
        this.offcanvasService.open(content, {position: 'start', scroll: true});
    }

    login(): void {
        this.userService.signinWithFirebase(this.email, this.password).then((user) => {
            user.subscribe((user) => {
                console.log(user);
            });
        });
    }

    register(): void {
        this.userService.registerWithFirebase(this.email, this.password).then((user) => {
            user.subscribe((user) => {
                console.log(user);
            });
        });
    }

}
