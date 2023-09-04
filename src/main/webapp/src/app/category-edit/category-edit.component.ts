import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Category } from '../category/category.model';
import { ToastrService } from 'ngx-toastr';
import { Image } from '../shared/image/image.model';
import { ImageService } from '../shared/image/image.service';

type ClickHandlerFunction = () => void;

@Component({
    selector: 'sgh-category-edit',
    templateUrl: './category-edit.component.html',
    styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {

    category: Category = {};
    categoryImage: Image = {};
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

    onFileChange(file: File) {
        this.categoryImage.file = file;
    }

    createCategory(): void {
        this.categoryService.create(this.category).subscribe(
            {
                next: (resp: Category): void => {
                    this.toastNotify.success(`Category "${resp.name}" successfully created!`);
                    this.category = resp;  // Update the category with the response data

                    // Check if an image file is available to upload
                    if (this.categoryImage.file) {
                        this.uploadImageAndUpdateCategory();
                    } else {
                        // No image to upload, so navigate to the categories list
                        this.navigateToCategoriesList();
                    }
                },
                error: (error): void => {
                    this.toastNotify.error(`Error creating category: ${error.error}`);
                }
            }
        );
    }

    uploadImageAndUpdateCategory(): void {
        if (this.categoryImage.file) {
            this.imageService.uploadImage(this.categoryImage.file as File).subscribe(
                {
                    next: (image: Image): void => {
                        this.category.imageId = image.id;  // Update the category with the uploaded image ID
                        this.toastNotify.success(`Image successfully uploaded with id ${image.id}`);

                        // Now update the category with the image ID
                        this.categoryService.update(this.category.id, this.category).subscribe(
                            {
                                next: (): void => {
                                    this.toastNotify.success(`Category successfully updated with image information!`);
                                    this.navigateToCategoriesList();
                                },
                                error: (error): void => {
                                    this.toastNotify.error(`Error updating category with image information: ${error.error}`);
                                }
                            }
                        );
                    },
                    error: (error): void => {
                        this.toastNotify.error(`Error uploading image: ${error.error}`);
                    }
                }
            );
        } else {
            this.toastNotify.error(`No image file to upload.`);
        }
    }

    navigateToCategoriesList(): void {
        this.router.navigate(['/admin/categories'])
            .then((): void => {
                this.toastNotify.success(`Navigation successful!`);
            })
            .catch((): void => {
                this.toastNotify.error(`Error redirecting to route '/admin/categories`);
            });
    }


    updateCategory(): void {
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
