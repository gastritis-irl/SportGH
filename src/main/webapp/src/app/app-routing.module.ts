import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from "./user/user.component";
import {AppComponent} from "./app.component";

const routes: Routes = [
    {
        path: '',
        title: 'Users',
        component: UserComponent,
    },
    {
        path: '/users',
        title: 'Users',
        component: UserComponent,
    },
    {
        path: '/app',
        title: 'App',
        component: AppComponent,
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
