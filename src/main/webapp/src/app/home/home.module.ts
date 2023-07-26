import {NgModule} from '@angular/core';
import {NgForOf} from "@angular/common";
import {HomeComponent} from "./home.component";
import {CategoryComponent} from "./category/category.component";
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {CarouselComponent} from "../shared/carousel/carousel.component";

@NgModule({
    declarations: [
        HomeComponent,
        CategoryComponent,
    ],
    imports: [
        NgForOf,
        NavbarComponent,
        CarouselComponent,
    ],
    providers: [
        CategoryComponent
    ],
    bootstrap: [],
})
export class HomeModule {

}
