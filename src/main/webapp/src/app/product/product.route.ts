import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductCreateComponent } from './product-post/product-create.component';

const routes: Routes = [
    {
        path: 'products',
        component: ProductListComponent,
    },
    {
        path: 'products/new',
        component: ProductCreateComponent,
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
