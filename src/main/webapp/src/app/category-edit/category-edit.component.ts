import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Category } from '../category/category.model';
import { ToastrService } from 'ngx-toastr';
import { Image } from '../shared/image/image.model';
import { ImageService } from '../shared/image/image.service';
import { ViewChild } from '@angular/core';
import { ImageComponent } from '../shared/image/image.component';

type ClickHandlerFunction = () => void;

@Component({
    selector: 'sgh-category-edit',
    templateUrl: './category-edit.component.html',
    styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {

    @ViewChild(ImageComponent, { static: false }) imageComponent?: ImageComponent;

    category: Category = {};
    newImageFile?: File; 
    imageData?: Image;
    clickHandlerFunction: ClickHandlerFunction = (): void => {
    };

    constructor(
        private categoryService: CategoryService,
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
                this.clickHandlerFunction = this.createCategory;
            }
            const id: number = parseInt(param);
            if (!isNaN(id)) {
                this.clickHandlerFunction = this.updateCategory;
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
            }
        }
    }

    loadCategoryImage(imageId: number) {
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

    onFileChange(file: File): void {
        this.newImageFile = file;
    }

    updateCategory(): void {
        if (this.newImageFile) {
            // If a new image file has been selected, upload it first
            this.imageService.uploadImage(this.newImageFile).subscribe(
                {
                    next: (image: Image) => {
                        // Update the category with the new image ID
                        this.category.imageId = image.id;
                        this.updateCategoryData();
                    },
                    error: (error) => {
                        console.error(error);
                        this.toastNotify.error('Error uploading new image');
                    }
                }
            );
        } else {
            // If no new image file has been selected, just update the category data
            this.updateCategoryData();
        }
    }

    createCategory(): void {
        if (this.newImageFile) {
            this.imageService.uploadImage(this.newImageFile).subscribe(
                {
                    next: (image: Image) => {
                        // Set the image ID on the category object
                        this.category.imageId = image.id;
                        this.createCategoryData();
                    },
                    error: (error) => {
                        console.error(error);
                        this.toastNotify.error('Error uploading new image');
                    }
                }
            );
        } else {
            // If no new image file has been selected, just create the category data
            this.createCategoryData();
        }
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
                    this.toastNotify.error(`Error creating category: ${error.error}`);

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
                    this.toastNotify.error(`Error updating category: ${error.error}`);
                }
            }
        );
    }
}
