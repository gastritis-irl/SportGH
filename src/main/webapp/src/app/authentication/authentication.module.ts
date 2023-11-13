import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationComponent } from './authentication.component';
import { RouterModule } from '@angular/router';
import { RequestsComponent } from '../shared/requests/requests.component';

@NgModule({
    declarations: [
        AuthenticationComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        RequestsComponent
    ],
    exports: [
        AuthenticationComponent
    ]
})
export class AuthModule { }
