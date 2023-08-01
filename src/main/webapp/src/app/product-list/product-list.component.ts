import { Component, Input, OnInit } from "@angular/core";
import { Product } from "../shared/product/product.model";
import { ProductService } from "../shared/product/product.service";

@Component({
    selector: 'sgh-product-list',
    templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {

    @Input() products: Product[] = [];

    constructor(private productService: ProductService) {
    }

    ngOnInit(): void {
        this.productService.getAll().subscribe(
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
