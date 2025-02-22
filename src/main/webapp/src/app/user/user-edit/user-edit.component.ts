import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ImageService } from '../../shared/image/image.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { ImageComponent } from '../../shared/image/image.component';
import { Image } from '../../shared/image/image.model';
import { FirebaseIdTokenService } from '../../auth-and-token/firebase-id-token.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
    selector: 'sgh-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

    @ViewChild(ImageComponent, { static: false }) imageComponent?: ImageComponent;

    username: string = '';
    user: User = {};
    newImageFile?: File;
    imageComponentMode: 'edit' | 'create' = 'edit';
    paramUid: string = '';

    constructor(
        private afAuth: AngularFireAuth,
        private userService: UserService,
        private toastNotify: ToastrService,
        private route: ActivatedRoute,
        private imageService: ImageService,
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
            uid = FirebaseIdTokenService.getDecodedIdToken()?.user_id;
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
                    this.router.navigate([`/users/profile`])
                        .catch((error): void => {
                            console.error(error);
                            this.toastNotify.error('Error redirecting to page');
                        });
                },
                error: (error): void => {
                    this.toastNotify.error('Error updating user');
                    console.error(error);
                }
            });
        }
    }

    async requestPasswordReset(): Promise<void> {
        if (this.user.email) {
            await this.afAuth.sendPasswordResetEmail(this.user.email).then((): void => {
                this.toastNotify.success(`Password reset email sent to ${this.user.email}`);
            }).catch((): void => {
                this.toastNotify.error(`Error sending password reset email to ${this.user.email}`);
            });
        } else {
            this.toastNotify.warning('Please log in first.');
        }
    }
}
