import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'sgh-product-filter',
    templateUrl: './product-filter.component.html',
    styleUrls: [ './product-filter.component.scss' ],
})
export class ProductFilterComponent implements OnInit {

    nrOfFilters: number = 0;
    isCollapsed: boolean[] = [];
    orderByElement: string = 'name';

    constructor() {
    }

    ngOnInit(): void {
        this.getDefaultValues();
        this.setDefaultValues();
    }

    getDefaultValues(): void {
        this.nrOfFilters = 5;
    }

    setDefaultValues(): void {
        // collapse all filters
        for (let i: number = 0; i < this.nrOfFilters; i++) {
            this.isCollapsed[i] = true;
        }
    }

    orderBy(): void {
    }

    range(from: number, to: number): number[] {
        if (from >= to) {
            return [];
        }
        const result: number[] = [];
        for (let i: number = from; i < to; i++) {
            result.push(i);
        }
        return result;
    }
}
