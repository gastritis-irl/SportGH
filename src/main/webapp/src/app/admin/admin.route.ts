import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListManageComponent } from './category-list-manage/category-list-manage.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { isAdmin } from '../auth-and-token/auth-guard.service';

const routes: Routes = [
    {
        path: 'admin/categories',
        component: CategoryListManageComponent,
        canActivate: [isAdmin]
    },
    {
        path: 'admin/categories/:categoryId',
        component: CategoryEditComponent,
        canActivate: [isAdmin]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AdminRoute {
}
