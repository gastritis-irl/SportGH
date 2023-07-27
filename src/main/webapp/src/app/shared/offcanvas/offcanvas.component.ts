import { Component, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'sgh-offcanvas',
    standalone: true,
    templateUrl: './offcanvas.component.html',
})
export class OffcanvasComponent {

    constructor(private offcanvasService: NgbOffcanvas) {
    }

    openOc(content: TemplateRef<any>): void {
        this.offcanvasService.open(content, {position: 'start', scroll: true});
    }
}
