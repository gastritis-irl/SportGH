import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationComponent } from './authentication.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AuthenticationComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        FormsModule
    ],
    exports: [
        AuthenticationComponent // If you want to use it in other modules
    ]
})
export class AuthModule { }
