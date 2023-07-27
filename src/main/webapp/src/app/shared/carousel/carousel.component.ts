import { Component, Input, OnInit } from '@angular/core';
import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { Category } from "../../home/category/category.model";

@Component({
    selector: 'sgh-carousel',
    standalone: true,
    imports: [NgbCarouselModule, NgIf, NgOptimizedImage, NgFor],
    templateUrl: './carousel.component.html',
})
export class CarouselComponent implements OnInit {

    @Input() categories: Category[] = [];

    constructor(private carouselConfig: NgbCarouselConfig) {
    }

    ngOnInit(): void {
        this.carouselConfig.interval = 5000;
        this.carouselConfig.wrap = false;
        this.carouselConfig.keyboard = true;
        this.carouselConfig.pauseOnHover = true;
    }
}
