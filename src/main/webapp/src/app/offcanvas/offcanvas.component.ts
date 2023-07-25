import {Component, TemplateRef, ViewEncapsulation} from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-offcanvas-options',
    standalone: true,
    templateUrl: './offcanvas.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class OffcanvasComponent {
    closeResult: string;

    // user informations (logged in / role / image / etc)
    userToken: string;

    constructor(private offcanvasService: NgbOffcanvas) {
        this.closeResult = '';
        this.userToken = 'jwt: 1234abcd, name: user1, <-- const string from component constructor';
    }

    openEnd(content: TemplateRef<any>) {
        this.offcanvasService.open(content, {position: 'end', scroll: true});
    }
}
