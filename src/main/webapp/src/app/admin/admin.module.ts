import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminRoute } from './admin.route';
import { CategoryEditComponent } from '../category-edit/category-edit.component';
import { AdminComponent } from './admin.component';
import { HomeModule } from '../home/home.module';
import { NgForOf } from '@angular/common';

@NgModule({
    declarations: [
        AdminComponent,
        CategoryEditComponent,
    ],
    imports: [
        AdminRoute,
        FormsModule,
        HomeModule,
        NgForOf,
    ],
    providers: [],
    bootstrap: []
})
export class AdminModule {
}
