import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';
import { RequestsComponent } from '../shared/requests/requests.component';

@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        RequestsComponent
    ],
    exports: [
        AuthComponent
    ]
})
export class AuthModule { }
