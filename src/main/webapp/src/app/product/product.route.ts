import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductComponent } from './product.component';
import { ProductAddComponent } from './product-add/product-add.component';

const routes: Routes = [
    {
        path: 'categories/:categoryId',
        component: ProductComponent,
    },
    {
        path: 'products/new',
        component: ProductAddComponent,
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
