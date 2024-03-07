import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../category/category.model';
import { Subcategory } from '../../subcategory/subcategory.model';
import { CustomFieldType, CustomFieldValue } from '../../subcategory/customFieldConfig.model';

@Component({
    selector: 'sgh-product-filter',
    templateUrl: './product-filter.component.html',
    styleUrls: ['./product-filter.component.scss'],
})
export class ProductFilterComponent implements OnInit {

    protected readonly String: StringConstructor = String;
    isExpanded: boolean[] = [];
    @Input() categories: Category[] = [];
    @Input() subcategories: Subcategory[] = [];
    @Input() categorySelected: boolean[] = [];
    @Input() selectedAtLeastOneSubCatOfCat: boolean[] = [];
    @Input() selectedExactlyOneSubCat: boolean = false;
    @Input() customFieldValues: CustomFieldValue[] = [];
    @Input() subcategorySelected: boolean[] = [];
    @Input() textSearch: string = '';
    @Input() minPrice: number = 0;
    @Input() maxPrice: number = 0;
    @Input() locationLat?: number;
    @Input() locationLng?: number;
    @Input() locationRadius?: number;

    @Output() changesEvent: EventEmitter<[number, number, string, boolean, number?, number?, number?]> =
        new EventEmitter<[number, number, string, boolean, number?, number?, number?]>();

    constructor() {
    }

    ngOnInit(): void {
    }

    filterBy(): void {
        this.changesEvent.emit([
            this.minPrice,
            this.maxPrice,
            this.textSearch,
            // selected exactly one subcategory
            this.subcategorySelected.length > 0 ? this.subcategorySelected.map((a: boolean): number => a ? 1 : 0).reduce((a: number, b: number) => a + b) === 1 : false,
            this.locationLat,
            this.locationLng,
            this.locationRadius
        ]);
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

    protected readonly CustomFieldType = CustomFieldType;
}
