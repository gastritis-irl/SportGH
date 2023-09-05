import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'sgh-product-filter',
    templateUrl: './product-filter.component.html',
    styleUrls: [ './product-filter.component.scss' ],
})
export class ProductFilterComponent implements OnInit {

    nrOfFilters: number = 5;
    isCollapsed: boolean[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }
}
