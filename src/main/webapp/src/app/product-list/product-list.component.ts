import { Component, Input, OnInit } from "@angular/core";
import { Product } from "./product/product.model";
import { ProductService } from "./product/product.service";

@Component({
    selector: 'sgh-product-list',
    templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {

    @Input() products: Product[] = [];

    constructor(private productService: ProductService) {
    }

    ngOnInit(): void {
        this.productService.getProducts().subscribe(
            {
                next: (data: Product[]): void => {
                    this.products = data;
                },
                error: (error): void => {
                    console.error('Error fetching data (products):', error);
                }
            }
        );
    }
}
