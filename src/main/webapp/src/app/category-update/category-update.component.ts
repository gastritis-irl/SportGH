import { Component, OnInit } from '@angular/core';
import { Category } from '../category/category.model';
import { CategoryService } from '../category/category.service';

@Component({
    selector: 'app-category-update',
    templateUrl: './category-update.component.html',
    styleUrls: ['./category-update.component.scss']
})
export class CategoryUpdateComponent implements OnInit {

    category: Category = {
        id: 0,
        name: '',
        description: '',
        imageURL: ''
    };

    constructor(private categoryService: CategoryService) {
    }

    ngOnInit(): void {
    }

    onSubmit(): void {
        this.categoryService.update(this.category.id, this.category).subscribe(
            {
                next: (): void => {
                },
                error: (error): void => {
                    console.error(error);
                }
            }
        );
    }
}
