//routing for the user page

import { UserDetailsComponent } from './user-details/user-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './user-edit/user-edit.component';


export const routes: Routes = [
    {
        path: 'users/:uid',
        component: UserDetailsComponent,
    },
    {
        path: 'users/:uid/edit',
        component: UserEditComponent,
    },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class UserRoute {
}
