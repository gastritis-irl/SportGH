import { NgModule } from '@angular/core';
import { CategoryCreateComponent } from '../category-create/category-create.component';
import { CategoryDeleteComponent } from '../category-delete/category-delete.component';
import { CategoryUpdateComponent } from '../category-update/category-update.component';
import { FormsModule } from '@angular/forms';
import { CategoryRoute } from './category.route';

@NgModule({
    declarations: [
        CategoryCreateComponent,
        CategoryDeleteComponent,
        CategoryUpdateComponent,
    ],
    imports: [
        CategoryRoute,
        FormsModule,
    ],
    providers: [],
    bootstrap: []
})
export class CategoryModule {
}
