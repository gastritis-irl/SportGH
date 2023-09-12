import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'sgh-navbar',
    standalone: true,
    imports: [
        RouterLink
    ],
    templateUrl: './breadcrumb.component.html',
    styleUrls: [ './breadcrumb.component.scss' ],
})
export class BreadcrumbComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }
}
