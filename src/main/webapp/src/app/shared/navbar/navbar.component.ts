import { Component } from '@angular/core';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { OffcanvasComponent } from "../offcanvas/offcanvas.component";

@Component({
    selector: 'sgh-navbar',
    standalone: true,
    imports: [NgbNavModule, NgbDropdownModule, OffcanvasComponent],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
}
