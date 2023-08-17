import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Category } from '../category/category.model';
import { ToastrService } from 'ngx-toastr';

type ClickHandlerFunction = () => void;

@Component({
    selector: 'sgh-category-edit',
    templateUrl: './category-edit.component.html',
    styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {

    id: number = 0;
    category: Category = {};
    clickHandlerFunction: ClickHandlerFunction = (): void => {
    };

    constructor(
        private categoryService: CategoryService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
    ) {
    }

    ngOnInit(): void {
        this.getParam();
    }

    getParam(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.loadData(params['categoryId']);
                },
                error: (error): void => {
                    console.error('Error fetching data (categoryId):', error);
                }
            }
        );
    }

    loadData(param: string | undefined): void {
        if (param) {
            if (param === 'new') {
                this.clickHandlerFunction = this.createCategory;
            }
            this.id = parseInt(param);
            if (!isNaN(this.id)) {
                this.clickHandlerFunction = this.updateCategory;
                this.categoryService.getById(this.id).subscribe(
                    {
                        next: (data: Category): void => {
                            this.category = data;
                        },
                        error: (error): void => {
                            alert(`Error fetching data (category with ID ${this.id}): ` + error);
                        }
                    }
                );
            }
        }
    }

    createCategory(): void {
        this.categoryService.create(this.category).subscribe(
            {
                next: (resp: Category): void => {
                    this.router.navigate(['/admin/categories'])
                        .then(() => this.toastr.success(`Category (ID ${resp.id}) successfully created!`));
                },
                error: (error): void => {
                    alert('Error creating category: status code:' + error.status);
                }
            }
        );
    }

    updateCategory(): void {
        this.categoryService.update(this.category.id, this.category).subscribe(
            {
                next: (): void => {
                    this.router.navigate(['/admin/categories'])
                        .then(() => this.toastr.success(`Category (ID ${this.category.id}) successfully updated!`));
                },
                error: (error): void => {
                    alert(`Error updating category (ID ${this.category.id}): status code:` + error.status);
                }
            }
        );
    }
}
