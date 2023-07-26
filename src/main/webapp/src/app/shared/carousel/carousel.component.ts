import {Component, OnInit} from '@angular/core';
import {NgbCarouselConfig, NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {NgFor, NgIf, NgOptimizedImage} from '@angular/common';
import {Category} from "../../home/category/category.model";
import {CategoryService} from "../../home/category/category.service";

@Component({
    selector: 'sgh-carousel',
    standalone: true,
    imports: [NgbCarouselModule, NgIf, NgOptimizedImage, NgFor],
    templateUrl: './carousel.component.html',
    providers: [NgbCarouselConfig],
})
export class CarouselComponent implements OnInit {

    categories: Category[];

    constructor(config: NgbCarouselConfig, private categoryService: CategoryService) {
        config.interval = 5000;
        config.wrap = false;
        config.keyboard = true;
        config.pauseOnHover = true;

        this.categories = [];
    }

    ngOnInit(): void {
        this.categoryService.getCategories().subscribe(
            {
                next: (response): void => {
                    this.categories = response;
                },
                error: (error): void => {
                    console.error('Error fetching data:', error);
                }
            }
        )
    }
}
