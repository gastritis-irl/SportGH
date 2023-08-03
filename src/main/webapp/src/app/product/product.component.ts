import { Component, Input, OnInit } from '@angular/core';
import { Product } from "./product.model";

@Component({
    selector: 'sgh-product',
    templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {

    @Input() products: Product[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }
}
