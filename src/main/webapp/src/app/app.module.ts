import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { UserComponent } from './user/user.component';
import { AppComponent } from "./app.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeModule } from "./home/home.module";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { ProductModule } from './product/product.module'
import { FormsModule } from '@angular/forms';

import * as firebase from 'firebase/app';
import {environment} from "./environment";
import { CategoryModule } from './category/category.module';
import { AdminModule } from './admin/admin.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

firebase.initializeApp(environment.firebaseConfig);


@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
    ],
    imports: [
        FormsModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgbModule,
        HomeModule,
        ProductModule,
        CategoryModule,
        AdminModule,
        NavbarComponent,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 250000,
        }),
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
