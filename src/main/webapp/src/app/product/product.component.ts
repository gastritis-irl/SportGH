import {Component, OnInit} from '@angular/core';
import {ProductService} from "./product.service";
import {Product} from "./product.model";

@Component({
    selector: 'sgh-product',
    templateUrl: './product.component.html',
    styleUrls: [''],
})
export class ProductComponent implements OnInit {

    products: Product[];

    constructor(private productService: ProductService) {
        this.products = [];
    }

    ngOnInit(): void {
        this.getProductsFromServer();
    }

    getProductsFromServer(): void {
        this.productService.getProducts().subscribe(
            {
                next: (response): void => {
                    this.products = response;
                },
                error: (error): void => {
                    console.error('Error fetching data:', error);
                }
            }
        )
    }
}
