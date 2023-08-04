import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { UserComponent } from './user/user.component';
import { AppComponent } from "./app.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeModule } from "./home/home.module";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { ProductModule } from './product/product.module';

import * as firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    databaseURL: "your-database-url",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

firebase.initializeApp(firebaseConfig);

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
        ProductModule,
        NavbarComponent,
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
