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

    constructor() {
    }

    ngOnInit(): void {
    }

    navToPage(pageNumber: number): void {
        this.newPageEvent.emit(pageNumber);
    }
}
