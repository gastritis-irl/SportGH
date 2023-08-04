import { Component, OnInit } from '@angular/core';
import { Category } from '../category/category.model';

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

    ngOnInit(): void {
    }

    onSubmit(): void {
        console.log("request sent: ", this.category);
    }
}
