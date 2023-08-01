import { NgModule } from "@angular/core";
import { NgFor } from '@angular/common';
import { ProductDetailsComponent } from './product-details.component';

@NgModule({
    declarations: [
        ProductDetailsComponent,
    ],
    imports: [
        NgFor,
    ],
    providers: [],
    bootstrap: [],
})
export class ProductListModule {

}
