import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ImageService } from '../shared/image/image.service';

@Component({
    selector: 'sgh-admin',
    templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
    categories: Category[] = [];

    constructor(
        private categoryService: CategoryService,
        private router: Router,
        private toastNotify: ToastrService,
        private imageService: ImageService,
    ) { }

    ngOnInit(): void {
        this.categoryService.getAll().subscribe({
            next: (data: Category[]) => {
                this.categories = data;
                this.categories.forEach(category => {
                    if (category.imageId !== undefined) {
                        this.loadCategoryImage(category.imageId, category);
                    }
                });
            },
            error: (error) => {
                console.error(error);
                this.toastNotify.error(`Error fetching data`);
            }
        });
    }

    loadCategoryImage(imageId: number, category: Category) {
        if (imageId === 0 || imageId === undefined || imageId === null) {
            return;
        }
        this.imageService.getImageFile(imageId).subscribe({
            next: (blob) => {
                const reader = new FileReader();
                reader.onload = () => {
                    category.imageDataUrl = reader.result as string;
                };
                if (blob) {
                    reader.readAsDataURL(blob);
                }
            },
            error: (error) => {
                console.error('Image fetch failed', error);
            }
        });
    }

    deleteCategory(categoryId: number | undefined, index: number): void {
        this.categoryService.delete(categoryId).subscribe(
            {
                next: (): void => {
                    this.categories.splice(index, 1);
                    this.router.navigate(['/admin/categories'])
                        .then((): void => {
                            this.toastNotify.success(`Category successfully deleted!`);
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
