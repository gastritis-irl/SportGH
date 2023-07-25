import {Component} from '@angular/core';
import {NgbDropdownModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'sgh-navbar',
    standalone: true,
    imports: [NgbNavModule, NgbDropdownModule],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
}
