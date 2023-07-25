import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from "./user/user.component";
import {CategoryComponent} from "./category/category.component";
import {OffcanvasComponent} from "./offcanvas/offcanvas.component";
import {CarouselComponent} from "./carousel/carousel.component";

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
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
