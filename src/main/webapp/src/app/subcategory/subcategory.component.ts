import { Component, Input, OnInit } from '@angular/core';
import { Subcategory } from './subcategory.model';
import { ToastrService } from 'ngx-toastr';
import { SubcategoryService } from './subcategory.service';
import { Router } from '@angular/router';
@Component({
    selector: 'sgh-subcategory',
    templateUrl: './subcategory.component.html',
    styleUrls: ['./subcategory.component.scss'],
})

export class SubcategoryComponent implements OnInit {
    subcategories: Subcategory[] = [];
    @Input() categoryId: number[] = [];

    constructor(
        private subcategoryService: SubcategoryService,
        private router: Router,
        private toastNotify: ToastrService,) {
    }
    ngOnInit() : void {
        this.subcategoryService.getByCategoryId(this.categoryId[0]).subscribe({
            next: (data: Subcategory[]) => {
                this.subcategories = data;
            },
            error: (error) => {
                console.error(error);
                this.toastNotify.error(`Error fetching data`);
            }
        });
    }

    deleteSubcategory(subcategoryIdAndIndex: number[]): void {
        this.subcategoryService.delete(subcategoryIdAndIndex[0]).subscribe(
            {
                next: (): void => {
                    this.subcategories.splice(subcategoryIdAndIndex[1], 1);
                    this.router.navigate(['/admin/categories/'])
                        .then((): void => {
                            this.toastNotify.success(`Subcategory successfully deleted!`);
                        })
                        .catch((): void => {
                            this.toastNotify.error('Error redirecting to route /admin/categories');
                        });
                },
                error: (error): void => {
                    this.toastNotify.error(`Error deleting category: ${error.error}`);
                }
            }
        );
    }
}
