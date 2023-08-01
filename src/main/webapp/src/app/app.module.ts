import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { UserComponent } from './user/user.component';
import { AppComponent } from "./app.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeModule } from "./home/home.module";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { ProductListModule } from "./product-list/product-list.module";

@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgbModule,
        HomeModule,
        ProductListModule,
        NavbarComponent,
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
