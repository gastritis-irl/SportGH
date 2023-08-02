import { NgModule } from "@angular/core";
import { NgFor } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductRoutingModule } from './product-routing.module';

@NgModule({
    declarations: [
        ProductDetailsComponent,
        ProductListComponent,
        ProductComponent,
    ],
    imports: [
        ProductRoutingModule,
        NgFor,
    ],
    providers: [
        ProductComponent,
    ],
    bootstrap: [],
})
export class ProductModule {

}
