import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../category/category.model';
import { CategoryService } from '../../category/category.service';
import { Subcategory } from '../../subcategory/subcategory.model';
import { SubcategoryService } from '../../subcategory/subcategory.service';
import { FirebaseIdTokenService } from '../../auth-and-token/firebase-id-token.service';
import { IdToken } from '../../auth-and-token/firebase-id-token.model';
import { Image } from '../../shared/image/image.model';
import { ImageService } from '../../shared/image/image.service';
import { ImageComponent } from '../../shared/image/image.component';

type ClickHandlerFunction = () => void;

@Component({
    selector: 'sgh-product-post',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent implements OnInit {

    @ViewChild(ImageComponent, { static: false }) imageComponent?: ImageComponent;

    product: Product = {};
    categories: Category[] = [];
    subcategories: Subcategory[] = [];
    subcategoryDropdownDisabled: boolean = true;
    clickHandlerFunction: ClickHandlerFunction = (): void => {
    };
    editMode: boolean = false;
    modeParam: 'create' | 'edit' = 'create';
    buttonPushed: boolean = false;
    _imageIds?: number[];
    newImageFiles: File[] = [];
    imageDatas: Image[] = [];

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private subcategoryService: SubcategoryService,
        private fbIdTokenService: FirebaseIdTokenService,
        private router: Router,
        private route: ActivatedRoute,
        private toastNotify: ToastrService,
        private imageService: ImageService,
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

    onFileChange(files: File[]): void {
        this.newImageFiles = files;
    }

    onFileRemoved(file: File): void {
        this.newImageFiles = this.newImageFiles.filter(f => f !== file);
    }

    checkEvent(isChecked: boolean): void {
        this.product.publicContact = isChecked;
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
            this.modeParam = 'create';
        } else {
            const id: number = parseInt(param);
            if (!isNaN(id)) {
                this.modeParam = 'edit';
                this.clickHandlerFunction = this.editProduct;
                this.editMode = true;

                this.productService.getById(id).subscribe(
                    {
                        next: (data: Product): void => {
                            this.product = data;
                            this.subcategoryDropdownDisabled = false;
                            this.getSubcategoriesByCategoryId();
                            // Call the loadProductImages method here
                            if (data.id) {
                                this.loadProductImageIds(data.id);
                            } else {
                                this.toastNotify.error(`Error loading images: ${data.id} is undefined`);
                            }
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


    loadProductImageIds(productId: number): void {
        this.imageService.getImageIdsByProductId(productId).subscribe({
            next: (response: Image[]): void => {
                try {
                    this._imageIds = response.map(image => image.id).filter(id => id !== undefined) as number[];
                } catch (error) {
                    this.toastNotify.error(`Error loading images: ${error}`);
                }
            },
            error: (): void => {
            }
        });
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
        this.product.publicContact = true;

        this.productService.create(this.product).subscribe(
            {
                next: (resp: Product): void => {

                    if (this.newImageFiles.length > 0) {
                        if (resp.id) {
                            this.uploadImages(resp.id, this.newImageFiles);
                        }
                    }

                    this.router.navigate([`/products/${resp.id}`])
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

    uploadImages(productId: number, files: File[]): void {
        files.forEach((file, index) => {
            if (file) {
                this.imageService.uploadImage(file, productId).subscribe({
                    next: (image: Image) => {
                        this.imageDatas[index] = image;
                    },
                    error: (error) => {
                        console.error(error);
                        this.toastNotify.error(`Error uploading image ${index + 1}`);
                    }
                });
            }
        });
    }

    editProduct(): void {
        this.buttonPushed = true;
        this.productService.edit(this.product).subscribe(
            {
                next: (resp: Product): void => {
                    this.router.navigate([`/products/${resp.id}`])
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

        if (this.newImageFiles.length > 0) {
            if (this.product.id) {
                this.uploadImages(this.product.id, this.newImageFiles);
            }
        }
    }

    cancelEdit(route: string): void {
        this.router.navigate([route])
            .catch((error): void => {
                console.error(error);
                this.toastNotify.error('Error redirecting to page');
            });
    }
}
