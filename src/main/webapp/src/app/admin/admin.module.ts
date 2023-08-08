import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminRoute } from './admin.route';
import { CategoryCreateComponent } from '../category-create/category-create.component';
import { CategoryUpdateComponent } from '../category-update/category-update.component';
import { CategoryDeleteComponent } from '../category-delete/category-delete.component';
import { AdminComponent } from './admin.component';
import { HomeModule } from '../home/home.module';

@NgModule({
    declarations: [
        AdminComponent,
        CategoryCreateComponent,
        CategoryUpdateComponent,
        CategoryDeleteComponent,
    ],
    imports: [
        AdminRoute,
        FormsModule,
        HomeModule,
    ],
    providers: [],
    bootstrap: []
})
export class AdminModule {
}
