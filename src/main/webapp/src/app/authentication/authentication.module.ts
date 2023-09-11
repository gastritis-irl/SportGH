import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationComponent } from './authentication.component';

@NgModule({
    declarations: [
        AuthenticationComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        AuthenticationComponent
    ]
})
export class AuthModule { }
