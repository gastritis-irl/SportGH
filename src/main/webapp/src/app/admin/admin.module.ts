import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminRoute } from './admin.route';
import { CategoryEditComponent } from '../category-edit/category-edit.component';
import { AdminComponent } from './admin.component';
import { HomeModule } from '../home/home.module';
import { NgForOf, NgIf } from '@angular/common';
import { ImageComponent } from "../shared/image/image.component";

@NgModule({
    declarations: [
        AdminComponent,
        CategoryEditComponent,
    ],
    providers: [],
    bootstrap: [],
    imports: [
        AdminRoute,
        FormsModule,
        HomeModule,
        NgForOf,
        NgIf,
        ImageComponent
    ]
})
export class AdminModule {
}
