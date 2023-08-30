import { NgModule } from "@angular/core";
import { NgFor } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductRoute } from './product.route';
import { ProductAddComponent } from './product-add/product-add.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ProductDetailsComponent,
        ProductListComponent,
        ProductAddComponent,
        ProductComponent,
    ],
    imports: [
        ProductRoute,
        NgFor,
        FormsModule,
    ],
    providers: [
        ProductComponent,
    ],
    bootstrap: [],
})
export class ProductModule {

}
