import { Component } from '@angular/core';
import { Category } from '../category/category.model';

@Component({
    selector: 'app-category-form',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent {

    category: Category = {};
    fields: (keyof Category)[];

    constructor() {
        this.fields = Object.keys(this.category) as (keyof Category)[];
        console.log(this.fields);
    }
}
