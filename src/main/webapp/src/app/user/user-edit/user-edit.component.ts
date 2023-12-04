import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ImageService } from '../../shared/image/image.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { ImageComponent } from '../../shared/image/image.component';
import { Image } from '../../shared/image/image.model';
import { FirebaseIdTokenService } from '../../auth-and-token/firebase-id-token.service';

@Component({
    selector: 'sgh-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

    @ViewChild(ImageComponent, { static: false }) imageComponent?: ImageComponent;

    username: string = '';
    user: User = { imageId: 0 };
    newImageFile?: File;
    imageComponentMode: 'edit' | 'create' = 'edit';
    paramUid: string = '';

    constructor(
        private userService: UserService,
        private toastNotify: ToastrService,
        private route: ActivatedRoute,
        private imageService: ImageService,
        private fbIdTokenService: FirebaseIdTokenService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.paramUid = params['uid'];
                    this.loadData(params['uid']);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }

    cancelEdit(route: string): void {
        this.router.navigate([route])
            .catch((error): void => {
                console.error(error);
                this.toastNotify.error('Error redirecting to page');
            });
    }

    loadData(uid: string | undefined): void {
        if (uid === 'profile') {
            uid = this.fbIdTokenService.getDecodedIdToken()?.user_id;
        }
        if (uid) {
            this.userService.getByUid(uid).subscribe({
                next: (data: User): void => {
                    this.user = data;
                },
                error: (error): void => {
                    if (error.status === 401) {
                        this.router.navigate(['/']);
                    } else {
                        this.toastNotify.error(`Error fetching data`);
                    }
                }
            });
        } else {
            this.router.navigate(['/']);
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
            this.userService.update(this.user.id, this.user).subscribe({
                next: (): void => {
                    this.toastNotify.success('User updated successfully');
                },
                error: (error): void => {
                    this.toastNotify.error('Error updating user');
                    console.error(error);
                }
            });
        }
    }

    onSubmit(): void {
        this.updateUser();
        this.router.navigate([`/users/${this.paramUid}`])
            .catch((error): void => {
                console.error(error);
                this.toastNotify.error('Error redirecting to page');
            });
    }
}
