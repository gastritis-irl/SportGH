import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Product } from '../product.model';
import { Params } from '@angular/router';
import { Category } from '../../category/category.model';
import { Subcategory } from '../../subcategory/subcategory.model';

@Component({
    selector: 'sgh-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: [ './product-list.component.scss' ],
})
export class ProductListComponent implements OnInit, OnChanges {

    @Input() products: Product[] = [];
    @Input() categories: Category[] = [];
    @Input() subcategories: Subcategory[] = [];
    @Output() newPageEvent: EventEmitter<number> = new EventEmitter<number>();
    currentPage: number = 1;
    @Output() orderByEvent: EventEmitter<string> = new EventEmitter<string>();
    orderByElement: string = 'name#ASC';
    @Input() nrOfPages: number = 0;
    @Input() nrOfItems: number = 0;
    @Input() filterParamsInput: Params = {};
    @Input() filterParamNamesInput: string[] = [];
    filterParams: string[] = [];
    filterParamNames: string[] = [];
    @Output() clearFilterEvent: EventEmitter<[ string, string ]> = new EventEmitter<[ string, string ]>();
    @Output() resetFilterEvent: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnChanges(): void {
        this.refreshFilterParams();
    }

    refreshFilterParams(): void {
        this.filterParamNames = [];
        this.filterParams = [];
        for (const p of this.filterParamNamesInput) {
            if (
                this.filterParamsInput[p]
                && p != 'pageNumber'
                && p != 'direction'
                && p != 'orderBy'
            ) {
                if (this.filterParamsInput[p].length != 0) {
                    this.filterParams.push(this.filterParamsInput[p]);
                    this.filterParamNames.push(p);
                }
            }
        }
    }

    resetFilters(): void {
        this.resetFilterEvent.emit();
    }

    clearFilter(paramName: string, paramItem: string): void {
        this.clearFilterEvent.emit([ paramName, paramItem ]);
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

    getTypeOfParam(param: string | number | undefined): string {
        return typeof param;
    }
}
