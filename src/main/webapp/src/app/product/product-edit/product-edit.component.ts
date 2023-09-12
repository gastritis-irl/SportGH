import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../category/category.model';
import { CategoryService } from '../../category/category.service';
import { Subcategory } from '../../subcategory/subcategory.model';
import { SubcategoryService } from '../../subcategory/subcategory.service';
import { Image } from '../../shared/image/image.model';
import { ImageService } from '../../shared/image/image.service';
import { ImageComponent } from '../../shared/image/image.component';

type ClickHandlerFunction = () => void;

@Component({
    selector: 'sgh-product-post',
    templateUrl: './product-edit.component.html',
    styleUrls: [ './product-edit.component.scss' ],
})
export class ProductEditComponent implements OnInit {

    @ViewChild('imageComponent', { static: false }) imageComponent?: ImageComponent;

    product: Product = {};
    categories: Category[] = [];
    subcategories: Subcategory[] = [];
    subcategoryDropdownDisabled: boolean = true;
    clickHandlerFunction: ClickHandlerFunction = (): void => {
    };
    editMode: boolean = false;
    modeParam: "create" | "edit" = "create";
    buttonPushed: boolean = false;
    _imageIds: number[] = [];
    newImageFiles: File[] = [];
    imageDatas: Image[] = [];

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

    onFileChange(files: File[]): void {
        if (files.length > 0) {
            this.newImageFiles = files;
        }
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
            this.modeParam = "create";
            this.initializeImageDatas();
        } else {
            const id: number = parseInt(param);
            if (!isNaN(id)) {
                this.modeParam = "edit";
                this.clickHandlerFunction = this.editProduct;
                this.editMode = true;

                this.productService.getById(id).subscribe(
                    {
                        next: (data: Product): void => {
                            this.product = data;
                            this.subcategoryDropdownDisabled = false;
                            this.getSubcategoriesByCategoryId();
                            this.initializeImageDatas(data.id);
                            this.toastNotify.info(`Loading ${data.imageIds?.length} images`);
                            this.loadProductImages(data);
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

    initializeImageDatas(productId?: number): void {
        this.imageDatas = [];
        for (let i = 0; i < 8; i++) {
            this.imageDatas.push({ id: undefined, imageDataUrl: undefined, productId: productId });
        }
    }

    loadProductImages(product: Product): void {
        if (product.imageIds && product.imageIds.length > 0) {
            product.imageIds.forEach((imageId, index) => {
                this.imageService.getImageFile(imageId).subscribe(blob => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        this.imageDatas[index].imageDataUrl = reader.result as string;
                    };
                    if (blob) {
                        reader.readAsDataURL(blob);
                    }
                });
            });
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
        this.buttonPushed = true;
        this.product.userId = 1;
        this.product.available = true;

        this.productService.create(this.product).subscribe(
            {
                next: (resp: Product): void => {

                    this.toastNotify.info(`Uploading ${this.newImageFiles.length} images`);
                    if (this.newImageFiles.length > 0) {
                        if (resp.id) {
                            this.uploadImages(resp.id, this.newImageFiles);
                        }
                    }


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

    uploadImages(productId: number, files: File[]): void {
        this.toastNotify.info(`Uploading ${files.length} images`);
        files.forEach((file, index) => {
            this.toastNotify.info(`Uploading image name: ${file.name} on product id: ${productId}`);
            if (file && productId) {
                this.imageService.uploadImage(file, productId).subscribe({
                    next: (image: Image) => {
                        this.toastNotify.success(`Image ${index + 1} successfully uploaded`);
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

        // After editing the product, upload the new images (if any)
        if (this.newImageFiles.length > 0) {
            if (this.product.id) {
                this.uploadImages(this.product.id, this.newImageFiles);
            }
        }
    }


    cancelEdit(route: string): void {
        this.router.navigate([ route ])
            .catch((error): void => {
                console.error(error);
                this.toastNotify.error('Error redirecting to page');
            });
    }

    set imageIds(ids: number[]) {
        this._imageIds = ids;
    }

    get imageIds(): number[] {
        return this._imageIds.filter((id: number): boolean => id !== 0);
    }
}
