import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { RouterModule } from '@angular/router';
import { UserRoute } from './user.route';
import { ImageComponent } from '../shared/image/image.component';
import { FormCheckLabelComponent } from '../shared/form-check-labels/form-check-label.component';
import { ProductModule } from "../product/product.module";
import { AuthModule } from '../authentication/authentication.module';

@NgModule({
    declarations: [
        UserDetailsComponent,
        UserEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UserRoute,
        ImageComponent,
        FormCheckLabelComponent,
        ProductModule,
        AuthModule
    ],
    exports: [
        UserDetailsComponent
    ]
})
export class UserModule { }
