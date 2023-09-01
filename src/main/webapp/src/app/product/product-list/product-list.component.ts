import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../product.model';

@Component({
    selector: 'sgh-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: [ './product-list.component.scss' ],
})
export class ProductListComponent implements OnInit {

    @Input() products: Product[] = [];
    @Output() newPageEvent: EventEmitter<number> = new EventEmitter<number>();
    currentPage: number = 1;
    @Input() nrOfPages: number = 1;
    @Input() nrOfItems: number = 0;

    constructor() {
    }

    ngOnInit(): void {
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
