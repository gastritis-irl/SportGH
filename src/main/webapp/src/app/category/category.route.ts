import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryCreateComponent } from '../category-create/category-create.component';
import { CategoryDeleteComponent } from '../category-delete/category-delete.component';
import { CategoryUpdateComponent } from '../category-update/category-update.component';

const routes: Routes = [
    {
        path: 'category/c',
        component: CategoryCreateComponent,
    },
    {
        path: 'category/u',
        component: CategoryUpdateComponent,
    },
    {
        path: 'category/d',
        component: CategoryDeleteComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class CategoryRoute {
}
