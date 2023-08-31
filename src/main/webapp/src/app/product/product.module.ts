import { NgModule } from "@angular/core";
import { NgFor, NgIf } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductRoute } from './product.route';

@NgModule({
    declarations: [
        ProductDetailsComponent,
        ProductListComponent,
        ProductComponent,
    ],
    imports: [
        ProductRoute,
        NgFor,
        NgIf,
    ],
    providers: [
        ProductComponent,
    ],
    bootstrap: [],
})
export class ProductModule {

}
