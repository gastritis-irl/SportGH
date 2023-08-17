import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user.model';

@Component({
    selector: 'sgh-user',
    templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {

    users: User[] = [];

    constructor(private userService: UserService) {
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
                    console.error(`Error fetching data (users): ${error}`);
                },
            }
        );
    }
}
