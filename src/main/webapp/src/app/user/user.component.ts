import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user.model';
import { ToastrService } from 'ngx-toastr';
import { Input } from '@angular/core';

@Component({
    selector: 'sgh-user',
    templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
    //input for username
    @Input() username: string = '';
    user: User = {};

    constructor(private userService: UserService, private toastNotify: ToastrService) {
    }

    ngOnInit(): void {
        this.userService.getByUsername(this.username).subscribe(user => {
            this.user = user;
        });
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
