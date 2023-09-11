import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user.model';
import { ToastrService } from 'ngx-toastr';
import { Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'sgh-user',
    templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
    //input for username
    @Input() username: string = '';
    user: User = {};
    imageFile?: File;

    constructor(private userService: UserService, private toastNotify: ToastrService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.loadData(params['username']);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }

    loadData(username: string | undefined): void {
        if (username) {
            this.userService.getByUsername(username).subscribe({
                next: (data: User): void => {
                    this.user = data;
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            });
        }
    }

    updateUser(): void {
        if (!this.user.id) {
            this.toastNotify.warning('User not found');
            return;
        }

        this.userService.update(this.user.id, this.user).subscribe(() => {
            this.toastNotify.success('User updated successfully');
        });
    }

}
