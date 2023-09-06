import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Params } from '@angular/router';
import { Category } from '../../category/category.model';
import { Subcategory } from '../../subcategory/subcategory.model';

@Component({
    selector: 'sgh-product-filter',
    templateUrl: './product-filter.component.html',
    styleUrls: [ './product-filter.component.scss' ],
})
export class ProductFilterComponent implements OnInit {

    isCollapsed: boolean[] = [];
    @Output() newFilterEvent: EventEmitter<string[]> = new EventEmitter<string[]>();
    categoryFilter: string[] = [];
    subcategoryFilter: string[] = [];
    priceFilter: number[] = [];
    filterParams: string[] = [
        'Category', '',
        'Subcategory', '',
        'Min Price', '',
        'Max Price', '',
    ];
    @Input() categories: Category[] = [];
    @Input() subcategories: Subcategory[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }

    filterBy(): void {
        this.newFilterEvent.emit(this.filterParams);
    }
}
