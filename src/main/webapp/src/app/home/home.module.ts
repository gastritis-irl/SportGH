import { NgModule } from '@angular/core';
import { NgForOf } from "@angular/common";
import { HomeComponent } from "./home.component";
import { CategoryComponent } from "../category/category.component";
import { CarouselComponent } from "../shared/carousel/carousel.component";
import { RouterLink } from '@angular/router';

@NgModule({
    declarations: [
        HomeComponent,
        CategoryComponent,
    ],
    imports: [
        NgForOf,
        CarouselComponent,
        RouterLink,
    ],
    providers: [
        CategoryComponent
    ],
    bootstrap: [],
    exports: [
        CategoryComponent
    ]
})
export class HomeModule {

}
