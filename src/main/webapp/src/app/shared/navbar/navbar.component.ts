import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { AuthModule } from '../../authentication/authentication.module';

import { NgForOf } from '@angular/common';

@Component({
    selector: 'sgh-navbar',
    standalone: true,
    imports: [NgbDropdownModule, RouterLink, AuthModule, NgForOf],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.scss'],
})
export class NavbarComponent {
}
