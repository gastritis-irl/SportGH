//user-edit.component.ts

// Path: src/app/user/user-edit/user-edit.component.ts

import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params } from '@angular/router';
import { ImageService } from '../../shared/image/image.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { ViewChild } from '@angular/core';
import { ImageComponent } from '../../shared/image/image.component';
import { Image } from '../../shared/image/image.model';


@Component({
    selector: 'sgh-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

    @ViewChild(ImageComponent, { static: false }) imageComponent?: ImageComponent;

    username: string = '';
    user: User = { id: undefined, username: '', email: '', phoneNumber: '', address: '', imageId: 0, imageDataUrl: undefined };
    newImageFile?: File;

    constructor(private userService: UserService, private toastNotify: ToastrService, private route: ActivatedRoute, private imageService: ImageService) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.loadData(params['uid']);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }

    loadData(uid: string | undefined): void {
        if (uid) {
            this.userService.getByUid(uid).subscribe({
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

    onFileChange(files: File[]): void {
        if (files.length > 0) {
            this.newImageFile = files[0];
        }
    }

    updateUser(): void {
        if (!this.user.id) {
            this.toastNotify.warning('User not found');
            return;
        }

        if (this.newImageFile) {
            this.imageService.uploadImage(this.newImageFile).subscribe(
                {
                    next: (image: Image): void => {
                        if (image.id) {
                            this.user.imageId = image.id;
                        }
                        this.updateUserData();
                    },
                    error: (error): void => {
                        console.error(error);
                        this.toastNotify.error(`Error uploading new image ${error.error}`);
                    }
                }
            );
        } else {
            this.updateUserData();
        }
    }

    updateUserData(): void {
        if (this.user.id) {
            this.userService.update(this.user.id, this.user).subscribe(() => {
                this.toastNotify.success('User updated successfully');
            });
        }
    }

    onSubmit(): void {
        this.updateUser();
    }
}
