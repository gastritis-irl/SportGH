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

    onFileChange(file: File): void {
        if (file) {
            this.imageService.uploadImage(file).subscribe(
                {
                    next: (image: Image) => {
                        this.category.imageId = image.id;
                        if (image.id) {
                            this.loadCategoryImage(image.id);
                        }
                        else {
                            this.toastNotify.error(`Error uploading image`);
                        }
                    },
                    error: (error) => {
                        console.error(error);
                        this.toastNotify.error(`Error uploading image`);
                    }
                }
            );
        }
    }

    createCategory(): void {
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
                }
            }
        );
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
