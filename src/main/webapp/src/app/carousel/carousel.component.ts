import {Component} from '@angular/core';
import {NgbCarouselConfig, NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {NgFor, NgIf, NgOptimizedImage} from '@angular/common';
import {Category} from "../category/category.model";

@Component({
    selector: 'ngbd-carousel-config',
    standalone: true,
    imports: [NgbCarouselModule, NgIf, NgOptimizedImage, NgFor],
    templateUrl: './carousel.component.html',
    providers: [NgbCarouselConfig],
})
export class CarouselComponent {
    categories: Category[];

    constructor(config: NgbCarouselConfig) {
        config.interval = 2000;
        config.wrap = false;
        config.keyboard = true;
        config.pauseOnHover = true;

        this.categories=[
            {
                categoryID: 1,
                categoryName: 'Cat1',
                categoryDescription: 'First category',
                categoryImageURL: `https://picsum.photos/id/700/900/500`,
            },
            {
                categoryID: 2,
                categoryName: 'Cat2',
                categoryDescription: 'Second category',
                categoryImageURL: `https://picsum.photos/id/533/900/500`,
            },
            {
                categoryID: 3,
                categoryName: 'Cat3',
                categoryDescription: 'Third category',
                categoryImageURL: `https://picsum.photos/id/807/900/500`,
            },
            {
                categoryID: 4,
                categoryName: 'Cat4',
                categoryDescription: 'Fourth category',
                categoryImageURL: `https://picsum.photos/id/124/900/500`,
            }
        ];
    }
}
