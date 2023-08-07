import { Component, OnInit } from '@angular/core';
import { Category } from '../category/category.model';
import { CategoryService } from '../category/category.service';

@Component({
    selector: 'app-category-form',
    templateUrl: './category-create.component.html',
    styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent implements OnInit {

    category: Category = {
        name: '',
        description: '',
        imageURL: ''
    };

    constructor(private categoryService: CategoryService) {
    }

    ngOnInit(): void {
    }

    onSubmit(): void {
        this.categoryService.create(this.category).subscribe(
            {
                next: (): void => {
                    alert("Ok");
                },
                error: (error): void => {
                    alert("Error");
                    console.error(error);
                }
            }
        );
    }
}
