import { Component, OnInit } from '@angular/core';
import { Category } from "./category.model";
import {CategoryService} from "./category.service";

@Component({
    selector: 'sgh-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

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
