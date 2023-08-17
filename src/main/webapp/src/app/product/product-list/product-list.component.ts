import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
    selector: 'sgh-product-list',
    templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {

    products: Product[] = [];

    constructor(private productService: ProductService) {
    }

    ngOnInit(): void {
        this.productService.getAll().subscribe(
            {
                next: (data: Product[]): void => {
                    this.products = data;
                },
                error: (error): void => {
                    console.error(`Error fetching data (products): ${error}`);
                }
            }
        );
    }
}
