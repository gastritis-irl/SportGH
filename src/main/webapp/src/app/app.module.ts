import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {UserComponent} from './user/user.component';
import {AppComponent} from "./app.component";
import {RouterModule} from "@angular/router";

@NgModule({
    declarations: [
        UserComponent,
        AppComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([
                { path: '', component: UserComponent },
            ]),
        HttpClientModule
    ],
    providers: [],
    bootstrap: [
        UserComponent,
        AppComponent
    ]
})
export class AppModule {
}
