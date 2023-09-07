import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationComponent } from './authentication.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        AuthenticationComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: AuthenticationComponent
            }
        ])
    ],
    exports: [
        AuthenticationComponent // If you want to use it in other modules
    ]
})
export class AuthModule { }
