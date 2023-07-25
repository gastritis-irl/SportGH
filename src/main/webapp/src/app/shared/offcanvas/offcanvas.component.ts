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

    // user information (logged in / role / image / etc)
    userData: string;

    constructor(private offcanvasService: NgbOffcanvas) {
        this.closeResult = '';
        this.userData = '';
    }

    openEnd(content: TemplateRef<any>) {
        this.offcanvasService.open(content, {position: 'end', scroll: true});
    }
}
