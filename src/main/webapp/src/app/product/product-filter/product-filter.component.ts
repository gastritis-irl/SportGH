import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../category/category.model';
import { Subcategory } from '../../subcategory/subcategory.model';

@Component({
    selector: 'sgh-product-filter',
    templateUrl: './product-filter.component.html',
    styleUrls: ['./product-filter.component.scss'],
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
    @Input() locationLat: number = 0;
    @Input() locationLng: number = 0;
    @Input() locationRadius: number = 0;

    @Output() changesEvent: EventEmitter<[number, number, string, number, number, number]> = new EventEmitter<[number, number, string, number, number, number]>();

    constructor() {
    }

    ngOnInit(): void {
    }

    filterBy(): void {
        this.changesEvent.emit([this.minPrice, this.maxPrice, this.textSearch, this.locationLat, this.locationLng, this.locationRadius]);
    }

    setRadius(): void {
        if (this.locationLat && this.locationLng) {
            this.filterBy();
        }
    }

    setLocation(coordinates: [number, number]): void {
        this.locationLat = coordinates[0];
        this.locationLng = coordinates[1];
        if (this.locationRadius) {
            this.filterBy();
        }
    }
}
