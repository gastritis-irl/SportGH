import { Component, OnInit } from '@angular/core';
import { Category } from "./category.model";
import {CategoryService} from "./category.service";
import { ToastrService } from 'ngx-toastr';
import { ImageService } from '../shared/image/image.service';
import { Image } from '../shared/image/image.model';

@Component({
    selector: 'sgh-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

    categories: Category[] = [];
    imageData?: Image;

    constructor(
        private categoryService: CategoryService,
        private toastNotify: ToastrService,
        private imageService: ImageService,
    ) {
    }

    loadCategoryImage(imageId: number, category: Category) {
        this.imageService.getImageFile(imageId).subscribe({
            next: (blob) => {
                const reader = new FileReader();
                reader.onload = () => {
                    category.imageDataUrl = reader.result as string;
                };
                if (blob) {
                    reader.readAsDataURL(blob);
                }
            },
            error: (error) => {
                console.error('Image fetch failed', error);
                this.toastNotify.error(`Error fetching image`);
            }
        });
    }



    ngOnInit(): void {
        this.categoryService.getAll().subscribe({
            next: (data: Category[]): void => {
                this.categories = data;
                this.categories.forEach(category => {
                    if (category.imageId !== undefined) {
                        this.loadCategoryImage(category.imageId, category);
                    }
                });
            },
            error: (error): void => {
                console.error(error);
                this.toastNotify.error(`Error fetching data`);
            }
        });
    }

}
