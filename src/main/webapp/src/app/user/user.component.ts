import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sgh-user',
    templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {

    users: User[] = [];

    constructor(
        private userService: UserService,
        private toastNotify: ToastrService,
    ) {
    }

    ngOnInit(): void {
        this.getUsersFromServer();
    }

    getUsersFromServer(): void {
        this.userService.getAll().subscribe(
            {
                next: (response: User[]): void => {
                    this.users = response;
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                },
            }
        );
    }
}
