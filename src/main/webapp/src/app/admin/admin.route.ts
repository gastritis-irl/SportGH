import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListManageComponent } from './category-list-manage/category-list-manage.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { isAdmin } from '../auth-and-token/auth-guard.service';
import { SubcategoryEditComponent } from './subcategory-edit/subcategory-edit.component';

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
    {
        path: 'admin/subcategories/:subcategoryId',
        component: SubcategoryEditComponent,
        canActivate: [isAdmin]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AdminRoute {
}
