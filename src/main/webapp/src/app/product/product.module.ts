import { NgModule } from "@angular/core";
import { NgFor, NgIf } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductRoute } from './product.route';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { FormsModule } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FormCheckLabelComponent } from '../shared/form-check-labels/form-check-label.component';

@NgModule({
    declarations: [
        ProductDetailsComponent,
        ProductListComponent,
        ProductEditComponent,
        ProductComponent,
    ],
    imports: [
        ProductRoute,
        NgFor,
        FormsModule,
        NgIf,
        NgbPopover,
        FormCheckLabelComponent,
    ],
    providers: [
        ProductComponent,
    ],
    bootstrap: [],
})
export class ProductModule {

}
