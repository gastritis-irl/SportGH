import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SubcategoryRoute } from './subcategory.route';
import { SubcategoryComponent } from './subcategory.component';
import {NgForOf} from "@angular/common";
import {PopoverDeleteComponent} from "../shared/popover/popover-delete.component";

@NgModule({
    declarations: [
        SubcategoryComponent
    ],
    imports: [
        SubcategoryRoute,
        FormsModule,
        NgForOf,
        PopoverDeleteComponent,
    ],
    providers: [],
    bootstrap: []
})
export class SubcategoryModule {
}
