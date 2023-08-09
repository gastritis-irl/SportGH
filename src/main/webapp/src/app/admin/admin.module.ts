import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminRoute } from './admin.route';
import { CategoryCreateComponent } from '../category-create/category-create.component';
import { CategoryEditComponent } from '../category-edit/category-edit.component';
import { AdminComponent } from './admin.component';
import { HomeModule } from '../home/home.module';
import { NgForOf } from '@angular/common';

@NgModule({
    declarations: [
        AdminComponent,
        CategoryCreateComponent,
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
