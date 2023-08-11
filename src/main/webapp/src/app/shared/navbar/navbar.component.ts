import { Component } from '@angular/core';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { AuthModule } from '../../authentication/authentication.module';

import { NgForOf, NgIf } from '@angular/common';

@Component({
    selector: 'sgh-navbar',
    standalone: true,
    imports: [NgbNavModule, NgbDropdownModule, RouterLink, AuthModule, NgForOf, NgIf],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
}
