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

        this.categories = [
            {
                categoryID: 1,
                name: 'Cat1',
                description: 'First category',
                imageURL: `https://picsum.photos/id/700/900/500`,
            },
            {
                categoryID: 2,
                name: 'Cat2',
                description: 'Second category',
                imageURL: `https://picsum.photos/id/533/900/500`,
            },
            {
                categoryID: 3,
                name: 'Cat3',
                description: 'Third category',
                imageURL: `https://picsum.photos/id/807/900/500`,
            },
            {
                categoryID: 4,
                name: 'Cat4',
                description: 'Fourth category',
                imageURL: `https://picsum.photos/id/124/900/500`,
            }
        ];
    }
}
