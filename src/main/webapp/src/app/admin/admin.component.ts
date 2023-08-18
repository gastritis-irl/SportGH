import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
                    this.toastNotify.error(`Error fetching data (categories)`);
                }
            }
        );
    }

    deleteCategory(categoryId: number | undefined, index: number): void {
        this.categoryService.delete(categoryId).subscribe(
            {
                next: (): void => {
                    this.categories.splice(index, 1);
                    this.router.navigate(['/admin/categories'])
                        .then((): void => {
                            this.toastNotify.success(`Category (ID ${categoryId}) successfully deleted!`);
                        })
                        .catch((): void => {
                            this.toastNotify.error('Error redirecting to route /admin/categories');
                        });
                },
                error: (error): void => {
                    this.toastNotify.error(`Error deleting category (ID ${categoryId}): ${error.error}`);
                }
            }
        );
    }
}
