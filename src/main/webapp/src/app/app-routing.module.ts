import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {AccessDeniedComponent} from "./shared/access-denied/access-denied.component";
// import {NotFoundComponent} from "./shared/not-found/not-found.component";

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'access-denied',
        component: AccessDeniedComponent,
    },
    // {
    //     path: '**',
    //     component: NotFoundComponent,
    // }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
