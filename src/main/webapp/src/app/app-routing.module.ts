import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { ProductListComponent } from "./product/product-list/product-list.component";
import { ProductDetailsComponent } from './product/product-details/product-details.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
