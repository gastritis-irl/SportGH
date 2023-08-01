import { NgModule } from "@angular/core";
import { ProductListComponent } from "./product-list.component";
import { ProductComponent } from "./product/product.component";

@NgModule({
    declarations: [
        ProductListComponent,
        ProductComponent,
    ],
    imports: [],
    providers: [
        ProductComponent,
    ],
    bootstrap: [],
})
export class ProductListModule {

}
