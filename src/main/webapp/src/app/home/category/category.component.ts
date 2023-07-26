import {Component, Input, OnInit} from '@angular/core';
import {Category} from "./category.model";
import {Observable, of} from "rxjs";

@Component({
    selector: 'sgh-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

    @Input() categoriesObservable: Observable<Category[]>;
    categories: Category[];

    constructor() {
        this.categories = [];
        this.categoriesObservable = of([]);
    }

    ngOnInit(): void {
        this.categoriesObservable.subscribe((data: Category[]): void => {
            this.categories = data;
        })
    }
}
