import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeModule } from './home/home.module';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ProductModule } from './product/product.module';
import { FormsModule } from '@angular/forms';
import { environment } from './environment';
import { CategoryModule } from './category/category.module';
import { AdminModule } from './admin/admin.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageService } from './shared/image/image.service';
import { UserModule } from './user/user.module';
import { FooterComponent } from './shared/footer/footer.component';
import { SpinnerComponent } from './shared/loader/spinner.component';
import { LoadingInterceptor } from './shared/loader/loading.interceptor';
import { AuthInterceptor } from './auth-and-token/auth-interceptor';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { AccessDeniedComponent } from './shared/access-denied/access-denied.component';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        NavbarComponent,
        SpinnerComponent,
        NotFoundComponent,
        AccessDeniedComponent,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        FormsModule,
        BrowserModule,
        HttpClientModule,
        NgbModule,
        HomeModule,
        ProductModule,
        CategoryModule,
        AdminModule,
        UserModule,
        AppRoutingModule,
        NavbarComponent,
        FooterComponent,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 10000,
        }),
    ],
    providers: [
        ImageService,
        {
            provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
        },
        {
            provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
