import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductRoute } from './product.route';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { FormsModule } from '@angular/forms';
import { NgbCollapse, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FormCheckLabelComponent } from '../shared/form-check-labels/form-check-label.component';
import { ImageComponent } from "../shared/image/image.component";
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { TreeViewComponent } from '../shared/treeview/tree-view.component';
import { BreadcrumbComponent } from '../shared/breadcrumb/breadcrumb.component';
import { PopoverDeleteComponent } from '../shared/popover/popover-delete.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwitchButtonComponent } from '../shared/switch-button/switch-button.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapComponent } from '../shared/map/map.component';

@NgModule({
    declarations: [
        ProductDetailsComponent,
        ProductListComponent,
        ProductEditComponent,
        ProductFilterComponent,
        ProductComponent,
    ],
    imports: [
        CommonModule,
        ProductRoute,
        NgFor,
        FormsModule,
        NgIf,
        NgbPopover,
        FormCheckLabelComponent,
        NgbCollapse,
        TreeViewComponent,
        ImageComponent,
        NgbModule,
        BreadcrumbComponent,
        PopoverDeleteComponent,
        SwitchButtonComponent,
        LeafletModule,
        MapComponent
    ],
    providers: [
        ProductComponent,
    ],
    bootstrap: [],
    exports: [
        ProductListComponent
    ]
})
export class ProductModule {

}
