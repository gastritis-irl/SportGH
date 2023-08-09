import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Category } from '../category/category.model';

@Component({
    selector: 'sgh-category-edit',
    templateUrl: './category-edit.component.html',
    styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {

    category: Category = {};

    constructor(private categoryService: CategoryService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.category.id = params["categoryId"];
                },
                error: (error): void => {
                    console.error('Error fetching data (categoryId):', error);
                }
            }
        );

        if (this.category.id) {
            this.categoryService.getById(this.category.id).subscribe(
                {
                    next: (data: Category): void => {
                        this.category = data;
                    },
                    error: (error): void => {
                        alert('Error');
                        console.error(error);
                    }
                }
            );
        }
    }

    deleteCategory(): void {
        this.categoryService.delete(this.category.id).subscribe(
            {
                next: (): void => {
                    this.router.navigate(['/admin/categories'])
                        .then(() => alert(`Category (ID ${this.category.id}) successfully deleted!`));
                },
                error: (error): void => {
                    alert('Error');
                    console.error(error);
                }
            }
        );
    }

    updateCategory(): void {
        this.categoryService.update(this.category.id, this.category).subscribe(
            {
                next: (): void => {
                    this.router.navigate([`/admin/categories/${this.category.id}`])
                        .then(() => alert(`Category (ID ${this.category.id}) successfully updated!`));
                },
                error: (error): void => {
                    alert('Error');
                    console.error(error);
                }
            }
        );
    }
}
