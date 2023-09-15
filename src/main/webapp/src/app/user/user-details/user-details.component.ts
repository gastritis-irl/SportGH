import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { ToastrService } from 'ngx-toastr';
import { Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ImageService } from '../../shared/image/image.service';

@Component({
    selector: 'sgh-user',
    templateUrl: './user-details.component.html',
    styleUrls: [ './user-details.component.scss' ]
})
export class UserDetailsComponent implements OnInit {

    @Input() username: string = '';
    user: User = {};
    imageFile?: File;

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
                    console.log(data);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            });
        }
    }
}
