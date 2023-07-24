import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {UserComponent} from './user/user.component';
import {AppComponent} from "./app.component";
import {CategoryComponent} from "./category/category.component";

@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
        CategoryComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
