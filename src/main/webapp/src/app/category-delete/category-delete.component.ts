import { Component, OnInit } from '@angular/core';
import { Category } from '../category/category.model';
import { CategoryService } from '../category/category.service';

@Component({
    selector: 'sgh-category-delete',
    templateUrl: './category-delete.component.html',
    styleUrls: ['./category-delete.component.scss']
})
export class CategoryDeleteComponent implements OnInit {

    category: Category = {
        id: 0,
    };

    constructor(private categoryService: CategoryService) {
    }

    ngOnInit(): void {
    }

    onSubmit(): void {
        this.categoryService.delete(this.category.id).subscribe(
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
