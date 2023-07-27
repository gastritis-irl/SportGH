import { Component, Input, OnInit } from '@angular/core';
import { CategoryService } from "./category/category.service";
import { Category } from "./category/category.model";
import { Observable, of } from "rxjs";

@Component({
    selector: 'sgh-home',
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

    @Input() categories: Observable<Category[]> = of([]);

    constructor(private categoryService: CategoryService) {
    }

    ngOnInit(): void {
        this.categories = this.categoryService.getCategories();
    }
}
