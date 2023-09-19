import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params } from '@angular/router';
import { ImageService } from '../../shared/image/image.service';

@Component({
    selector: 'sgh-user',
    templateUrl: './user-details.component.html',
    styleUrls: [ './user-details.component.scss' ]
})
export class UserDetailsComponent implements OnInit {

    username: string = '';
    user: User = { id: undefined, username: '', email: '', phoneNumber: '', address: '', imageId: 0, imageDataUrl: undefined };
    image: string = '';

    constructor(
        private userService: UserService,
        private toastNotify: ToastrService,
        private route: ActivatedRoute,
        private imageService: ImageService
    ) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.loadData(params['email']);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }

    loadData(email: string | undefined): void {
        if (email) {
            this.userService.getByEmail(email).subscribe({
                next: (data: User): void => {
                    this.user = data;
                    this.loadImage(data.imageId ? data.imageId : null);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            });
        }
    }

    loadImage(imageId: number | null): void {
        if (imageId) {
            this.imageService.getImageFile(imageId).subscribe({
                next: (blob: Blob): void => {
                    this.image = this.imageService.readImageBlob(blob);
                },
                error: (error): void => {
                    this.toastNotify.error(`Error fetching image`, error);
                }
            });
        }
    }
}
