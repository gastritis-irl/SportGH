import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../category/category.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Category } from '../../category/category.model';
import { ToastrService } from 'ngx-toastr';
import { Image } from '../../shared/image/image.model';
import { ImageService } from '../../shared/image/image.service';
import { ViewChild } from '@angular/core';
import { ImageComponent } from '../../shared/image/image.component';
import { SubcategoryService } from '../../subcategory/subcategory.service';
import { Subcategory } from '../../subcategory/subcategory.model';

type ClickHandlerFunction = () => void;

@Component({
    selector: 'sgh-category-edit',
    templateUrl: './category-edit.component.html',
})
export class CategoryEditComponent implements OnInit {

    @ViewChild(ImageComponent, { static: false }) imageComponent?: ImageComponent;

    category: Category
        = { id: undefined, name: '', description: '', imageId: 0, imageDataUrl: undefined };
    subcategories: Subcategory[] = [];
    newImageFile?: File;
    paramCheck: 'create' | 'edit' = 'create';
    clickHandlerFunction: ClickHandlerFunction = (): void => {
    };
    editMode: boolean = false;
    buttonPushed: boolean = false;

    constructor(
        private categoryService: CategoryService,
        private subcategoryService: SubcategoryService,
        private router: Router,
        private route: ActivatedRoute,
        private toastNotify: ToastrService,
        private imageService: ImageService,
    ) {
    }

    ngOnInit(): void {
        this.loadDataByParam();
    }

    loadDataByParam(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.loadData(params['categoryId']);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }

    loadData(param: string | undefined): void {
        if (param) {
            if (param === 'new') {
                this.paramCheck = 'create';
                this.clickHandlerFunction = this.createCategory;
                this.editMode = false;
            }
            const id: number = parseInt(param);
            if (!isNaN(id)) {
                this.paramCheck = 'edit';
                this.clickHandlerFunction = this.updateCategory;
                this.editMode = true;
                this.categoryService.getById(id).subscribe(
                    {
                        next: (data: Category) => {
                            this.category = data;
                            if (data.imageId !== undefined) {
                                this.loadCategoryImage(data.imageId);
                            }
                        },
                        error: (error) => {
                            console.error(error);
                            this.toastNotify.error(`Error fetching data`);
                        }
                    }
                );
                this.subcategoryService.getByCategoryId(id).subscribe(
                    {
                        next: (data: Subcategory[]) => {
                            this.subcategories = data;
                        },
                        error: (error) => {
                            console.error(error);
                            this.toastNotify.error(`Error fetching data`);
                        }
                    }
                );
            }
        }
    }

    loadCategoryImage(imageId: number) {
        if (!imageId) {
            return;
        }

        this.imageService.getImageFile(imageId).subscribe(blob => {
            const reader = new FileReader();
            reader.onload = () => {
                this.category.imageDataUrl = reader.result as string;
            };
            if (blob) {
                reader.readAsDataURL(blob);
            }
        });
    }

    onFileChange(files: File[]): void {
        if (files.length > 0) {
            this.newImageFile = files[0];
        }
    }


    updateCategory(): void {
        if (this.newImageFile) {
            if (this.category.imageId !== null && this.category.imageId !== undefined) {
                // If the category already has an associated image, update the existing image
                this.imageService.updateFile(this.category.imageId, this.newImageFile).subscribe(
                    {
                        next: (image: Image) => {
                            // Update the category with the new image ID
                            if (image.id) {
                                this.category.imageId = image.id;
                            }
                            this.updateCategoryData();
                        },
                        error: (error) => {
                            console.error(error);
                            this.toastNotify.error(`Error uploading new image ${error.error}`);
                        }
                    }
                );
            } else {
                // If the category does not already have an associated image, upload the new image
                this.imageService.uploadImage(this.newImageFile).subscribe(
                    {
                        next: (image: Image) => {
                            // Update the category with the new image ID
                            if (image.id) {
                                this.category.imageId = image.id;
                            }
                            this.updateCategoryData();
                        },
                        error: (error) => {
                            console.error(error);
                            this.toastNotify.error(`Error uploading new image ${error.error}`);
                        }
                    }
                );
            }
        } else {
            // If no new image file has been selected, just update the category data
            this.updateCategoryData();
        }
    }

    createCategory(): void {
        if (this.newImageFile) {
            this.uploadImageAndCreateCategory(this.newImageFile);
        } else {
            this.toastNotify.warning('Image is required');
        }
    }

    uploadImageAndCreateCategory(file: File): void {
        this.imageService.uploadImage(file).subscribe(
            {
                next: (image: Image): void => {
                    // Set the image ID on the category object
                    if (image.id) {
                        this.category.imageId = image.id;
                    }
                    this.createCategoryData();
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error uploading new image${error.error}`);
                }
            }
        );
    }

    createCategoryData(): void {
        this.categoryService.create(this.category).subscribe(
            {
                next: (resp: Category): void => {
                    this.router.navigate(['/admin/categories'])
                        .then((): void => {
                            this.toastNotify.success(`Category "${resp.name}" successfully created!`);
                        })
                        .catch((): void => {
                            this.toastNotify.error(`Error redirecting to route '/admin/categories`);
                        });
                },
                error: (error): void => {
                    if (error.status === 0) {
                        this.toastNotify.error('Error creating category: unauthorized');
                    } else {
                        this.toastNotify.error(`Error creating category: ${error.error}`);
                    }

                    // Delete the image if it was created
                    if (this.category.imageId) {
                        this.imageService.deleteImage(this.category.imageId);
                    }
                }
            }
        );
    }


    updateCategoryData(): void {
        this.categoryService.update(this.category.id, this.category).subscribe(
            {
                next: (): void => {
                    this.router.navigate(['/admin/categories'])
                        .then((): void => {
                            this.toastNotify.success(`Category successfully updated!`);
                        })
                        .catch((): void => {
                            this.toastNotify.error(`Error redirecting to route /admin/categories`);
                        });
                },
                error: (error): void => {
                    if (error.status === 0) {
                        this.toastNotify.error('Error creating category: unauthorized');
                    } else {
                        this.toastNotify.error(`Error creating category: ${error.error}`);
                    }
                }
            }
        );
    }

    deleteSubcategory(subcategoryIdAndIndex: number[], categoryId: number | undefined): void {
        this.subcategoryService.delete(subcategoryIdAndIndex[0]).subscribe(
            {
                next: (): void => {
                    this.subcategories.splice(subcategoryIdAndIndex[1], 1);
                    this.router.navigate([`/admin/categories/${categoryId}`])
                        .then((): void => {
                            this.toastNotify.success(`Subcategory successfully deleted!`);
                        })
                        .catch((): void => {
                            this.toastNotify.error('Error redirecting to route /admin/categories');
                        });
                },
                error: (error): void => {
                    this.toastNotify.error(`Error deleting category: ${error.error}`);
                }
            }
        );
    }
}
