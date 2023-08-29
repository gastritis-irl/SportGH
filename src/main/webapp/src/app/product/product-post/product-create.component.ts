import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../category/category.model';
import { CategoryService } from '../../category/category.service';
import { Subcategory } from '../../subcategory/subcategory.model';
import { SubcategoryService } from '../../subcategory/subcategory.service';

@Component({
    selector: 'sgh-product-post',
    templateUrl: './product-create.component.html',
    styleUrls: [ './product-create.component.scss' ],
})
export class ProductCreateComponent implements OnInit {

    product: Product = {};
    categories: Category[] = [];
    categoryId: number = 0;
    subcategories: Subcategory[] = [];
    subcategoryDropdownDisabled: boolean = true;
    formBtnDisabled: boolean = true;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private subcategoryService: SubcategoryService,
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

    checkForm(): void {
        let filled: boolean = true;
        let inputIsCorrect: boolean = true;
        if (filled && inputIsCorrect) {
            this.formBtnDisabled = false;
        }
    }

    getSubcategoriesByCategoryId(): void {
        this.subcategoryService.getByCategoryId(this.categoryId).subscribe(
            {
                next: (data: Subcategory[]): void => {
                    this.subcategories = data;
                    console.log(data, this.categoryId);
                    this.subcategoryDropdownDisabled = false;
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error loading subcategories`);
                }
            }
        );
    }

    createProduct(): void {
        this.productService.create(this.product).subscribe(
            {
                next: (resp: Product): void => {
                    this.router.navigate([ `/products/${resp.id}` ])
                        .catch((error: string): void => {
                            console.error(error);
                            this.toastNotify.info('Error redirecting to page');
                        });
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error creating product: ${error}`);
                }
            }
        );
    }
}
