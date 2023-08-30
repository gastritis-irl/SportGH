import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sgh-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: [ './product-details.component.scss' ],
})
export class ProductDetailsComponent implements OnInit {

    product: Product = {};

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private toastNotify: ToastrService,
    ) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.loadProduct(params['productId']);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }

    loadProduct(productId: number): void {
        this.productService.getById(productId).subscribe(
            {
                next: (data: Product): void => {
                    this.product = data;
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }
}
