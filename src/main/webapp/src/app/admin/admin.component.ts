import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category.model';

@Component({
    selector: 'sgh-admin',
    templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {

    categories: Category[] = [];

    constructor(private categoryService: CategoryService) {
    }

    ngOnInit(): void {
        this.categoryService.getAll().subscribe(
            {
                next: (data: Category[]): void => {
                    this.categories = data;
                },
                error: (error): void => {
                    console.error('Error fetching data (categories):', error);
                }
            }
        );
    }
}
