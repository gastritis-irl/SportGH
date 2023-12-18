import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminRoute } from './admin.route';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryListManageComponent } from './category-list-manage/category-list-manage.component';
import { HomeModule } from '../home/home.module';
import { NgForOf, NgIf } from '@angular/common';
import { ImageComponent } from "../shared/image/image.component";
import { FormCheckLabelComponent } from '../shared/form-check-labels/form-check-label.component';
import { PopoverDeleteComponent } from '../shared/popover/popover-delete.component';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {SubcategoryEditComponent} from "./subcategory-edit/subcategory-edit.component";

@NgModule({
    declarations: [
        CategoryListManageComponent,
        CategoryEditComponent,
        SubcategoryEditComponent,
    ],
    bootstrap: [],
    imports: [
        AdminRoute,
        FormsModule,
        HomeModule,
        NgForOf,
        NgIf,
        ImageComponent,
        FormCheckLabelComponent,
        PopoverDeleteComponent,
        NgbPopover,
        NgbDropdownItem,
        NgbDropdownMenu,
        NgbDropdown,
        NgbDropdownToggle
    ]
})
export class AdminModule {
}
