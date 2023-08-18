import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sgh-product-list',
    templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {

    products: Product[] = [];

    constructor(
        private productService: ProductService,
        private toastNotify: ToastrService,
    ) {
    }

    ngOnInit(): void {
        this.productService.getAll().subscribe(
            {
                next: (data: Product[]): void => {
                    this.products = data;
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }
}
