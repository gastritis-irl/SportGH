import { Component, OnInit } from '@angular/core';
import { Category } from '../category/category.model';

@Component({
    selector: 'app-category-form',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

    category: Category = {};

    ngOnInit(): void {
    }

    onSubmit(): void {
        // send request
    }
}
