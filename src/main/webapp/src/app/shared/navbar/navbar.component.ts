import { Component } from '@angular/core';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { OffcanvasComponent } from "../offcanvas/offcanvas.component";
import { RouterLink } from '@angular/router';
import { NgForOf } from '@angular/common';

@Component({
    selector: 'sgh-navbar',
    standalone: true,
    imports: [NgbNavModule, NgbDropdownModule, OffcanvasComponent, RouterLink, NgForOf],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
}
