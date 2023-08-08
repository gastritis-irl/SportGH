import { Component } from '@angular/core';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { SharedModule } from '../shared.module';


@Component({
    selector: 'sgh-navbar',
    standalone: true,
    imports: [NgbNavModule, NgbDropdownModule,SharedModule, RouterLink],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
}
