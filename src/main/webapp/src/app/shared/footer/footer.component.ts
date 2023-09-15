import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatDate, getLocaleTimeFormat } from '@angular/common';

@Component({
    selector: 'sgh-footer',
    standalone: true,
    imports: [
        RouterLink
    ],
    templateUrl: './footer.component.html',
    styleUrls: [ './footer.component.scss' ],
})
export class FooterComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

    protected readonly getLocaleTimeFormat = getLocaleTimeFormat;
    protected readonly Date = Date;
    protected readonly formatDate = formatDate;
}
