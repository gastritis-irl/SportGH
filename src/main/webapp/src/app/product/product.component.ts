import { Component, OnInit } from '@angular/core';
import { ProductService } from "./product.service";
import { Product } from "./product.model";

@Component({
    selector: 'sgh-product',
    templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {

    products: Product[] = [];

    constructor(private productService: ProductService) {
    }

    ngOnInit(): void {
        this.getProductsFromServer();
    }

    getProductsFromServer(): void {
        this.productService.getProducts().subscribe(
            {
                next: (response: Product[]): void => {
                    this.products = response;
                },
                error: (error): void => {
                    console.error('Error fetching data (products):', error);
                }
            }
        );
    }
}
