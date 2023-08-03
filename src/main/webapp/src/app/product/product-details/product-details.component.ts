import { Component, OnInit } from "@angular/core";
import { Product } from "../product.model";
import { ProductService } from "../product.service";
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'sgh-product-details',
    templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {

    product: Product = {};
    productId: number = 0;

    constructor(private productService: ProductService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.productId = params["productId"];
                },
                error: (error): void => {
                    console.error('Error fetching data (productId):', error);
                }
            }
        );

        this.productService.getById(this.productId).subscribe(
            {
                next: (data: Product): void => {
                    this.product = data;
                },
                error: (error): void => {
                    console.error('Error fetching data (product):', error);
                }
            }
        );
    }
}
