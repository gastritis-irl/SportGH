import {Component, Input, OnInit} from '@angular/core';
import {NgbCarouselConfig, NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {NgFor, NgIf, NgOptimizedImage} from '@angular/common';
import {Category} from "../../home/category/category.model";
import {Observable, of} from "rxjs";

@Component({
    selector: 'sgh-carousel',
    standalone: true,
    imports: [NgbCarouselModule, NgIf, NgOptimizedImage, NgFor],
    templateUrl: './carousel.component.html',
    providers: [NgbCarouselConfig],
})
export class CarouselComponent implements OnInit {

    @Input() categoriesObservable: Observable<Category[]>;
    categories: Category[];

    constructor(config: NgbCarouselConfig) {
        config.interval = 5000;
        config.wrap = false;
        config.keyboard = true;
        config.pauseOnHover = true;

        this.categoriesObservable = of([]);
        this.categories = [];
    }

    ngOnInit(): void {
        this.categoriesObservable.subscribe((data: Category[]): void => {
            this.categories = data;
        })
    }
}
