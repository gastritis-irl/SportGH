import { Component, OnInit } from '@angular/core';
import { Category } from '../category/category.model';
import { CategoryService } from '../category/category.service';
import { Router } from '@angular/router';

@Component({
    selector: 'sgh-category-create',
    templateUrl: './category-create.component.html',
    styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent implements OnInit {

    category: Category = {
        name: '',
        description: '',
        imageURL: ''
    };

    constructor(private categoryService: CategoryService, private router: Router) {
    }

    ngOnInit(): void {
    }

    createCategory(): void {
        this.categoryService.create(this.category).subscribe(
            {
                next: (resp: Category): void => {
                    this.router.navigate(['/admin/categories'])
                        .then(() => alert(`Category (ID ${resp.id}) successfully created!`));
                },
                error: (error): void => {
                    alert('Error');
                    console.error(error);
                }
            }
        );
    }
}
