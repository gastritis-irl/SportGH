import {Component, OnInit} from '@angular/core';
import {Category} from "./category.model";
import {CategoryService} from "./category.service";

@Component({
    selector: 'sgh-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

    categories: Category[];

    constructor(private categoryService: CategoryService) {
        this.categories = [{}];
    }

    ngOnInit(): void {
        this.getTemplateCategories();
    }

    getCategoriesFromServer(): void {
        this.categoryService.getCategories().subscribe(
            {
                next: (response) => {
                    this.categories = response;
                },
                error: (error) => {
                    console.error('Error fetching data:', error);
                },
            }
        );
    }

    getTemplateCategories(): void {
        this.categories = [
            {
                categoryID: 1,
                name: 'Cat1',
                description: 'First category',
                imageURL: `https://picsum.photos/id/700/900/500`,
            },
            {
                categoryID: 2,
                name: 'Cat2',
                description: 'Second category',
                imageURL: `https://picsum.photos/id/533/900/500`,
            },
            {
                categoryID: 3,
                name: 'Cat3',
                description: 'Third category',
                imageURL: `https://picsum.photos/id/807/900/500`,
            },
            {
                categoryID: 4,
                name: 'Cat4',
                description: 'Fourth category',
                imageURL: `https://picsum.photos/id/124/900/500`,
            }
        ];
    }
}
