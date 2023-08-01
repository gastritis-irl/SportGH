import { NgModule } from "@angular/core";
import { ProductListComponent } from "./product-list.component";
import { ProductComponent } from "../shared/product/product.component";
import { NgFor } from '@angular/common';

@NgModule({
    declarations: [
        ProductListComponent,
        ProductComponent,
    ],
    imports: [
        NgFor,
    ],
    providers: [
        ProductComponent,
    ],
    bootstrap: [],
})
export class ProductListModule {

}
