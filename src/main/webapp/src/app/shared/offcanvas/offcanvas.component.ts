import {Component, TemplateRef, ViewEncapsulation} from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'sgh-offcanvas',
    standalone: true,
    templateUrl: './offcanvas.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [],
})
export class OffcanvasComponent {

    closeResult: string;

    // user information (logged in / role / image / etc)
    userData: string;

    constructor(private offcanvasService: NgbOffcanvas) {
        this.closeResult = '';
        this.userData = '';
    }

    openOc(content: TemplateRef<any>) {
        this.offcanvasService.open(content, {position: 'start', scroll: true});
    }
}
