import { Component, Input, OnInit } from '@angular/core';
import { Category } from "./category.model";

@Component({
    selector: 'sgh-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

    @Input() categories: Category[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }
}
