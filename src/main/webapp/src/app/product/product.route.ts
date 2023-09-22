import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductComponent } from './product.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { isLoggedIn } from '../auth-and-token/auth-guard.service';

const routes: Routes = [
    {
        path: 'products',
        component: ProductComponent,
    },
    {
        path: 'products/new',
        component: ProductEditComponent,
        canActivate: [isLoggedIn]
    },
    {
        path: 'products/:productId/edit',
        component: ProductEditComponent,
        canActivate: [isLoggedIn]
    },
    {
        path: 'products/:productId',
        component: ProductDetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class ProductRoute {
}
