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

    isExpanded: boolean[] = [];
    @Output() newFilterEvent: EventEmitter<Params> = new EventEmitter<Params>();
    @Input() filterParamNames: string[] = [];
    @Input() filterParams: Params = {};
    @Input() categories: Category[] = [];
    @Input() subcategories: Subcategory[] = [];
    selectedAtLeastOneSubCatOfCat: boolean[] = [];
    categorySelected: boolean[] = [];
    subcategorySelected: boolean[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }

    filterBy(): void {
        this.filterParams['Category'] = [];
        for (let i: number = 0; i < this.categories.length; i++) {
            if (this.categorySelected[i]) {
                this.filterParams['Category'].push(this.categories[i].name);
            }
        }

        this.filterParams['Subcategory'] = [];
        for (let i: number = 0; i < this.subcategories.length; i++) {
            if (this.subcategorySelected[i]) {
                this.filterParams['Subcategory'].push(this.subcategories[i].name);
            }
        }
        this.newFilterEvent.emit(this.filterParams);
    }
}
