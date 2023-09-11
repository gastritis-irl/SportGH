//module for the user component

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './user-details/user.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { RouterModule } from '@angular/router';
import { UserRoute } from './user.route';

@NgModule({
    declarations: [
        UserComponent,
        UserEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UserRoute
    ],
    exports: [
        UserComponent // If you want to use it in other modules
    ]
})
export class UserModule { }