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
import { CustomFieldConfig, CustomFieldType } from '../../subcategory/customFieldConfig.model';

type ClickHandlerFunction = () => void;

@Component({
    selector: 'sgh-product-post',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent implements OnInit {

    @ViewChild(ImageComponent, { static: false }) imageComponent?: ImageComponent;

    product: Product = { customFieldValues: [] };
    categories: Category[] = [];
    subcategories: Subcategory[] = [];
    subcategoryDropdownDisabled: boolean = true;
    customFieldsDisabled: boolean = true;
    clickHandlerFunction: ClickHandlerFunction = (): void => {
    };
    editMode: boolean = false;
    modeParam: 'create' | 'edit' = 'create';
    buttonPushed: boolean = false;
    _imageIds?: number[];
    newImageFiles: File[] = [];
    imageDatas: Image[] = [];
    protected readonly CustomFieldType = CustomFieldType;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private subcategoryService: SubcategoryService,
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

    setLocation(coordinates: [number, number]): void {
        this.product.locationLat = coordinates[0];
        this.product.locationLng = coordinates[1];
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
                            if (this.product.customFieldValues) {
                                this.customFieldsDisabled = false;
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
        this.customFieldsDisabled = true;
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

    getCustomFieldsBySubcategoryId(): void {
        if (this.product.subCategoryId) {
            this.product.customFieldValues = [];
            this.subcategoryService.getCustomFieldsById(this.product.subCategoryId).subscribe(
                {
                    next: (data: CustomFieldConfig[]): void => {
                        if (data) {
                            for (let i: number = 0; i < data.length; i++) {
                                this.product.customFieldValues!.push({ value: null, config: data[i] });
                            }
                            this.customFieldsDisabled = false;
                        }
                    },
                    error: (error): void => {
                        console.error(error);
                        this.toastNotify.error(`Error loading custom fields`);
                    }
                }
            );
        }
    }

    private async uploadProductImages(productId: number): Promise<void> {
        const imageUploadPromises = this.newImageFiles.map((imageFile) =>
            this.imageService.uploadImage(imageFile, productId).toPromise()
        );

        try {
            await Promise.all(imageUploadPromises);
            this.navigateToProduct(productId);
        } catch (error) {
            console.error('Error uploading images:', error);
            this.toastNotify.error('Error uploading images');
        }
    }

    private navigateToProduct(productId: number): void {
        this.router.navigate(['/products', productId])
            .catch((error) => {
                console.error('Error redirecting to product page:', error);
                this.toastNotify.error('Error redirecting to product page');
            });
    }

    createProduct(): void {
        const idToken: IdToken | null = FirebaseIdTokenService.getDecodedIdToken();
        if (!idToken) {
            this.toastNotify.warning('Please log in first.');
            return;
        } else {
            this.product.userUid = idToken.user_id;
        }
        this.buttonPushed = true;
        this.product.publicContact = true;

        this.productService.create(this.product).subscribe({
            next: async (resp: Product): Promise<void> => {
                await this.uploadProductImages(resp.id!);
            },
            error: (): void => {
                this.toastNotify.warning('Error saving product');
            }
        });
    }

    async editProduct(): Promise<void> {
        this.buttonPushed = true;
        this.productService.edit(this.product).subscribe({
            next: async (resp: Product): Promise<void> => {
                await this.uploadProductImages(resp.id!);
            },
            error: (): void => {
                this.toastNotify.warning('Error saving product');
            }
        });
    }

    cancelEdit(route: string): void {
        this.router.navigate([route])
            .catch((error): void => {
                console.error(error);
                this.toastNotify.error('Error redirecting to page');
            });
    }
}
