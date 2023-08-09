import { Component, Input, OnInit } from '@angular/core';
import { Category } from "./category.model";
import { CategoryService } from './category.service';

@Component({
    selector: 'sgh-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

    @Input() categories: Category[] = [];

    constructor(private categoryService: CategoryService) { }


    ngOnInit(): void {
        this.categoryService.getAll().subscribe((categories) => {
            this.categories = categories;
        });
    }
}
