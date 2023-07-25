import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from "./user/user.component";
import {CategoryComponent} from "./home/category/category.component";
import {OffcanvasComponent} from "./shared/offcanvas/offcanvas.component";
import {CarouselComponent} from "./shared/carousel/carousel.component";
import {ProductComponent} from "./product/product.component";
import {NavbarComponent} from "./shared/navbar/navbar.component";

const routes: Routes = [
    {
        path: 'users',
        title: 'Users',
        component: UserComponent,
    },
    {
        path: 'categories',
        title: 'Categories',
        component: CategoryComponent,
    },
    {
        path: 'offcanvas',
        title: 'Offcanvas',
        component: OffcanvasComponent,
    },
    {
        path: 'carousel',
        title: 'Carousel',
        component: CarouselComponent,
    },
    {
        path: 'products',
        title: 'Products',
        component: ProductComponent,
    },
    {
        path: 'navbar',
        title: 'Navbar',
        component: NavbarComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
