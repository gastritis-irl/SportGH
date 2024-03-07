import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../product.model';
import { Subcategory } from '../../subcategory/subcategory.model';
import { Category } from '../../category/category.model';
import { CustomFieldValue } from '../../subcategory/customFieldConfig.model';

@Component({
    selector: 'sgh-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {

    @Input() products: Product[] = [];
    @Input() categories: Category[] = [];
    @Input() subcategories: Subcategory[] = [];
    @Input() subcategorySelected: boolean[] = [];
    @Input() customFieldValues: CustomFieldValue[] = [];
    @Input() categorySelected: boolean[] = [];
    @Input() textSearch: string = '';
    @Input() minPrice: number = 0;
    @Input() maxPrice: number = 0;
    @Input() locationLat?: number;
    @Input() locationLng?: number;
    @Input() locationRadius?: number;
    @Input() nrOfPages: number = 0;
    @Input() nrOfItems: number = 0;
    currentPage: number = 1;
    orderByElement: string = 'name#ASC';

    @Output() newPageEvent: EventEmitter<number> = new EventEmitter<number>();
    @Output() orderByEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() clearFilterEvent: EventEmitter<[string, boolean]> = new EventEmitter<[string, boolean]>();
    @Output() resetFilterEvent: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    resetFilters(): void {
        this.resetFilterEvent.emit();
    }

    clearFilter(paramName: string, paramIndex: number): void {
        this.subcategorySelected[paramIndex] = false;
        let checkedSubWithSameCat: boolean = false;
        for (let i: number = 0; i < this.subcategories.length; i++) {
            if (this.subcategories[i].categoryId == this.subcategories[paramIndex].categoryId
                && this.subcategorySelected[i]) {
                checkedSubWithSameCat = true;
                break;
            }
        }
        if (!checkedSubWithSameCat) {
            for (let i: number = 0; i < this.categories.length; i++) {
                if (this.categories[i].id == this.subcategories[paramIndex].categoryId) {
                    this.categorySelected[i] = false;
                    break;
                }
            }
        }

        this.clearFilterEvent.emit([paramName, true]);
    }

    clearMultipleFilters(paramNames: string[]): void {
        for (let i: number = 0; i < paramNames.length; i++) {
            this.clearFilterEvent.emit([paramNames[i], i >= paramNames.length - 1]);
        }
    }

    anyActiveFilter(): boolean {
        return this.textSearch != '' ||
            this.minPrice != 0 ||
            this.maxPrice != 0 ||
            this.subcategorySelected.find((e: boolean) => e) != null;
    }

    orderBy(): void {
        this.orderByEvent.emit(this.orderByElement);
    }

    navToPage(): void {
        this.newPageEvent.emit(this.currentPage);
    }

    selectPage(currentPage: number): void {
        this.currentPage = currentPage;
        this.navToPage();
    }

    nextPage(): void {
        this.currentPage++;
        this.navToPage();
    }

    previousPage(): void {
        this.currentPage--;
        this.navToPage();
    }

    range(from: number, to: number): number[] {
        if (from > to) {
            return [];
        }
        const result: number[] = [];
        for (let i: number = from; i <= to; i++) {
            result.push(i);
        }
        return result;
    }
}
