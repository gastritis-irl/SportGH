import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../category/category.model';
import { CategoryService } from '../../category/category.service';
import { Subcategory } from '../../subcategory/subcategory.model';
import { SubcategoryService } from '../../subcategory/subcategory.service';
import { FirebaseIdTokenService } from '../../authentication/firebase-id-token.service';
import { IdToken } from '../../authentication/firebase-id-token.model';

type ClickHandlerFunction = () => void;

@Component({
    selector: 'sgh-product-post',
    templateUrl: './product-edit.component.html',
    styleUrls: [ './product-edit.component.scss' ],
})
export class ProductEditComponent implements OnInit {

    product: Product = {};
    categories: Category[] = [];
    subcategories: Subcategory[] = [];
    subcategoryDropdownDisabled: boolean = true;
    clickHandlerFunction: ClickHandlerFunction = (): void => {
    };
    editMode: boolean = false;
    buttonPushed: boolean = false;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private subcategoryService: SubcategoryService,
        private fbIdTokenService: FirebaseIdTokenService,
        private router: Router,
        private route: ActivatedRoute,
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
        this.loadDataByParam();
    }

    loadDataByParam(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.loadData(params['productId']);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }

    loadData(param: string | undefined): void {
        if (!param) {
            this.clickHandlerFunction = this.createProduct;
            this.editMode = false;
        } else {
            const id: number = parseInt(param);
            if (!isNaN(id)) {
                this.clickHandlerFunction = this.editProduct;
                this.editMode = true;
                this.productService.getById(id).subscribe(
                    {
                        next: (data: Product): void => {
                            this.product = data;
                            this.subcategoryDropdownDisabled = false;
                            this.getSubcategoriesByCategoryId();
                        },
                        error: (error): void => {
                            console.error(error);
                            this.toastNotify.error(`Error fetching data`);
                        }
                    }
                );
            }
        }
    }

    getSubcategoriesByCategoryId(): void {
        this.subcategoryService.getByCategoryId(this.product.categoryId ? this.product.categoryId : 0).subscribe(
            {
                next: (data: Subcategory[]): void => {
                    this.subcategories = data;
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
        const idToken: IdToken | null = this.fbIdTokenService.getDecodedIdToken();
        if (!idToken) {
            this.toastNotify.warning('Please log in first.');
            return;
        } else {
            this.product.userUid = idToken.user_id;
        }
        this.buttonPushed = true;

        this.productService.create(this.product).subscribe(
            {
                next: (resp: Product): void => {
                    this.router.navigate([ `/products/${resp.id}` ])
                        .catch((error: string): void => {
                            console.error(error);
                            this.toastNotify.info('Error redirecting to page');
                        });
                },
                error: (): void => {
                    this.toastNotify.warning('Error creating product');
                }
            }
        );
    }

    editProduct(): void {
        this.buttonPushed = true;
        this.productService.edit(this.product).subscribe(
            {
                next: (resp: Product): void => {
                    this.router.navigate([ `/products/${resp.id}` ])
                        .catch((error: string): void => {
                            console.error(error);
                            this.toastNotify.info('Error redirecting to page');
                        });
                },
                error: (): void => {
                    this.toastNotify.warning('Error editing product');
                }
            }
        );
    }

    cancelEdit(route: string): void {
        this.router.navigate([ route ])
            .catch((error): void => {
                console.error(error);
                this.toastNotify.error('Error redirecting to page');
            });
    }
}
