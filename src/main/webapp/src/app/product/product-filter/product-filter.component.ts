import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
    selector: 'sgh-product-filter',
    templateUrl: './product-filter.component.html',
    styleUrls: [ './product-filter.component.scss' ],
})
export class ProductFilterComponent implements OnInit {

    nrOfFilters: number = 0;
    @Input() filterNames: string[] = [];
    isCollapsed: boolean[] = [];
    @Output() newFilterEvent: EventEmitter<[ string, string ]> = new EventEmitter<[ string, string ]>();
    filterParams: [ string, string ] = [ '', '' ];

    constructor() {
    }

    ngOnInit(): void {
        this.getDefaultValues();
        this.setDefaultValues();
    }

    filterBy(): void {
        this.newFilterEvent.emit(this.filterParams);
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
