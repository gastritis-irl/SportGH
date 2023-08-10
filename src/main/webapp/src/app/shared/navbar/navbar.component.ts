import { Component } from '@angular/core';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { SharedModule } from '../shared.module';
import { AuthModule } from '../../authentication/authentication.module';


@Component({
    selector: 'sgh-navbar',
    standalone: true,
    imports: [NgbNavModule, NgbDropdownModule, RouterLink, SharedModule, AuthModule],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
}
