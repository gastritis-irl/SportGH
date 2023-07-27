import { Component, Input, OnInit } from '@angular/core';
import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { Category } from "../../home/category/category.model";
import { Observable, of } from "rxjs";

@Component({
    selector: 'sgh-carousel',
    standalone: true,
    imports: [NgbCarouselModule, NgIf, NgOptimizedImage, NgFor],
    templateUrl: './carousel.component.html',
})
export class CarouselComponent implements OnInit {

    @Input() categoriesObservable: Observable<Category[]> = of([]);
    categories: Category[] = [];

    constructor(private carouselConfig: NgbCarouselConfig) {
    }

    ngOnInit(): void {
        this.carouselConfig.interval = 5000;
        this.carouselConfig.wrap = false;
        this.carouselConfig.keyboard = true;
        this.carouselConfig.pauseOnHover = true;

        this.categoriesObservable.subscribe((data: Category[]): void => {
            this.categories = data;
        })
    }
}
