import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CategoryEditComponent } from '../category-edit/category-edit.component';

const routes: Routes = [
    {
        path: 'admin/categories',
        component: AdminComponent,
    },
    {
        path: 'admin/categories/:categoryId',
        component: CategoryEditComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AdminRoute {
}
