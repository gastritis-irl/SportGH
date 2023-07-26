import {Component} from '@angular/core';
import {NgbCarouselConfig, NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {NgFor, NgIf, NgOptimizedImage} from '@angular/common';
import {Category} from "../../home/category/category.model";
import {CategoryComponent} from "../../home/category/category.component";

@Component({
    selector: 'sgh-carousel',
    standalone: true,
    imports: [NgbCarouselModule, NgIf, NgOptimizedImage, NgFor],
    templateUrl: './carousel.component.html',
    providers: [NgbCarouselConfig],
})
export class CarouselComponent {

    categories: Category[];

    constructor(config: NgbCarouselConfig, private catComp: CategoryComponent) {
        config.interval = 5000;
        config.wrap = false;
        config.keyboard = true;
        config.pauseOnHover = true;

        catComp.getTemplateCategories();
        this.categories = catComp.categories;
    }
}
