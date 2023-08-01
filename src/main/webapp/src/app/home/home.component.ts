import { Component, Input, OnInit } from '@angular/core';
import { CategoryService } from "../shared/category/category.service";
import { Category } from "../shared/category/category.model";

@Component({
    selector: 'sgh-home',
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

    @Input() categories: Category[] = [];

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
