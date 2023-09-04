import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductComponent } from './product.component';
import { ProductEditComponent } from './product-edit/product-edit.component';

const routes: Routes = [
    {
        path: 'products',
        component: ProductComponent,
    },
    {
        path: 'products/new',
        component: ProductEditComponent,
    },
    {
        path: 'products/:productId/edit',
        component: ProductEditComponent,
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
