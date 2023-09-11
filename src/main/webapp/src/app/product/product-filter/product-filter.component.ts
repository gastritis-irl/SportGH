import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../category/category.model';
import { Subcategory } from '../../subcategory/subcategory.model';

@Component({
    selector: 'sgh-product-filter',
    templateUrl: './product-filter.component.html',
    styleUrls: [ './product-filter.component.scss' ],
})
export class ProductFilterComponent implements OnInit {

    isExpanded: boolean[] = [];
    @Input() categories: Category[] = [];
    @Input() subcategories: Subcategory[] = [];
    @Input() categorySelected: boolean[] = [];
    @Input() selectedAtLeastOneSubCatOfCat: boolean[] = [];
    @Input() subcategorySelected: boolean[] = [];
    @Input() textSearch: string = '';
    @Input() minPrice: number = 0;
    @Input() maxPrice: number = 0;

    @Output() changesEvent: EventEmitter<[ number, number ]> = new EventEmitter<[ number, number ]>();

    constructor() {
    }

    ngOnInit(): void {
    }

    filterBy(): void {
        this.changesEvent.emit([ this.minPrice, this.maxPrice ]);
    }
}
