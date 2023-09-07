//routing for the user page

import { Routes } from '@angular/router';
import { UserComponent } from './user.component';
// import { UserEditComponent } from '../user-edit/user-edit.component';

export const UserRoutes: Routes = [
    {
        path: 'users/:username',
        component: UserComponent,
    },
    {
        path: 'users/:username/edit',
        // component: UserEditComponent,
    },
];