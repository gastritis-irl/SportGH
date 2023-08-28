import { NgModule } from "@angular/core";
import { NgFor } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductRoute } from './product.route';
import { ProductCreateComponent } from './product-post/product-create.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ProductDetailsComponent,
        ProductListComponent,
        ProductCreateComponent,
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
