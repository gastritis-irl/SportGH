import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from "./user/user.component";
import {CategoryComponent} from "./home/category/category.component";
import {OffcanvasComponent} from "./shared/offcanvas/offcanvas.component";
import {CarouselComponent} from "./shared/carousel/carousel.component";
import {ProductComponent} from "./product/product.component";
import {NavbarComponent} from "./shared/navbar/navbar.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
