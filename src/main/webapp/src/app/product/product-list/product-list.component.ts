import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../product.model';

@Component({
    selector: 'sgh-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {

    @Input() products: Product[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }
}
