import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../category/category.model';
import { CategoryService } from '../../category/category.service';

@Component({
    selector: 'sgh-product-post',
    templateUrl: './product-create.component.html',
})
export class ProductCreateComponent implements OnInit {

    product: Product = {};
    categories: Category[] = [];

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private router: Router,
        private toastNotify: ToastrService,
    ) {
    }

    ngOnInit(): void {
        this.categoryService.getAll().subscribe(
            {
                next: (data: Category[]): void => {
                    this.categories = data;
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error loading categories`);
                }
            }
        );
    }

    createProduct(): void {
        this.productService.create(this.product).subscribe(
            {
                next: (resp: Product): void => {
                    this.router.navigate([`/products/${resp.id}`])
                        .catch((error): void => {
                            console.error(error);
                            this.toastNotify.info('Error redirecting to page');
                        });
                },
                error: (error): void => {
                    this.toastNotify.error(`Error creating product: ${error}`);
                }
            }
        );
    }
}
