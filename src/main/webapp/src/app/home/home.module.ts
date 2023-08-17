import { NgModule } from '@angular/core';
import { NgForOf } from "@angular/common";
import { HomeComponent } from "./home.component";
import { CategoryComponent } from "../category/category.component";
import { RouterLink } from '@angular/router';

@NgModule({
    declarations: [
        HomeComponent,
        CategoryComponent,
    ],
    imports: [
        NgForOf,
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
