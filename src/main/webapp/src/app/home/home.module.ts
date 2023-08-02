import { NgModule } from '@angular/core';
import { NgForOf } from "@angular/common";
import { HomeComponent } from "./home.component";
import { CategoryComponent } from "../category/category.component";
import { CarouselComponent } from "../shared/carousel/carousel.component";

@NgModule({
    declarations: [
        HomeComponent,
        CategoryComponent,
    ],
    imports: [
        NgForOf,
        CarouselComponent,
    ],
    providers: [
        CategoryComponent
    ],
    bootstrap: [],
})
export class HomeModule {

}
