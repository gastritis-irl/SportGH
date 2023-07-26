import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {UserComponent} from './user/user.component';
import {AppComponent} from "./app.component";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ProductComponent} from "./product/product.component";
import {HomeModule} from "./home/home.module";

@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
        ProductComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgbModule,
        HomeModule,
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
