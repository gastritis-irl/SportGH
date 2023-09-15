//user-edit.component.ts

// Path: src/app/user/user-edit/user-edit.component.ts

import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params } from '@angular/router';
import { ImageService } from '../../shared/image/image.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';


@Component({
    selector: 'sgh-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

        username: string = '';
        user: User = {};
        imageFile?: File;

        constructor(private userService: UserService, private toastNotify: ToastrService, private route: ActivatedRoute, private imageService: ImageService) {
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

    onSubmit(): void {
        this.updateUser();
    }
}
