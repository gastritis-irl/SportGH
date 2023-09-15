import { NgModule } from '@angular/core';
import { NgForOf } from "@angular/common";
import { HomeComponent } from "./home.component";
import { CategoryComponent } from "../category/category.component";
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        HomeComponent,
        CategoryComponent,
    ],
    imports: [
        NgForOf,
        RouterLink,
        ReactiveFormsModule,
        FormsModule,
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
