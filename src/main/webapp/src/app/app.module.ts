import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {UserComponent} from './user/user.component';
import {AppComponent} from "./app.component";
import {CategoryComponent} from "./category/category.component";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ProductComponent} from "./product/product.component";

@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
        CategoryComponent,
        ProductComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgbModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
