import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../product.model';
import { Subcategory } from '../../subcategory/subcategory.model';

@Component({
    selector: 'sgh-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: [ './product-list.component.scss' ],
})
export class ProductListComponent implements OnInit {

    @Input() products: Product[] = [];
    @Input() subcategories: Subcategory[] = [];
    @Input() subcategorySelected: boolean[] = [];
    @Input() textSearch: string = '';
    @Input() minPrice: number = 0;
    @Input() maxPrice: number = 0;
    @Input() nrOfPages: number = 0;
    @Input() nrOfItems: number = 0;
    currentPage: number = 1;
    orderByElement: string = 'name#ASC';

    @Output() newPageEvent: EventEmitter<number> = new EventEmitter<number>();
    @Output() orderByEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() clearFilterEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() resetFilterEvent: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit(): void {
    }

    resetFilters(): void {
        this.resetFilterEvent.emit();
    }

    clearFilter(paramName: string, paramIndex: number): void {
        this.subcategorySelected[paramIndex] = false;
        this.clearFilterEvent.emit(paramName);
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
