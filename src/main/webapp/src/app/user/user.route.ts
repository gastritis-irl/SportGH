//routing for the user page

import { UserComponent } from './user.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { UserEditComponent } from '../user-edit/user-edit.component';

export const routes: Routes = [
    {
        path: 'users/:username',
        component: UserComponent,
    },
    // {
    //     path: 'users/:username/edit',
    //     // component: UserEditComponent,
    // },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class UserRoute {
}