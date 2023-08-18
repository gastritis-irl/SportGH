import { Component, OnInit } from '@angular/core';
import { Category } from "./category.model";
import {CategoryService} from "./category.service";
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sgh-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

    categories: Category[] = [];

    constructor(
        private categoryService: CategoryService,
        private toastNotify:ToastrService
    ) {
    }

    ngOnInit(): void {
        this.categoryService.getAll().subscribe(
            {
                next: (data: Category[]): void => {
                    this.categories = data;
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error('Error fetching data (categories)');
                }
            }
        );
    }
}
