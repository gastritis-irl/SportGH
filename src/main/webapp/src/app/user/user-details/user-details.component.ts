import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params } from '@angular/router';
import { ImageService } from '../../shared/image/image.service';
import { ViewportScroller } from '@angular/common';
import { Product } from "../../product/product.model";
import { ProductService } from "../../product/product.service";
import { ProductPage } from "../../product/product-page.model";

@Component({
    selector: 'sgh-user',
    templateUrl: './user-details.component.html',
    styleUrls: [ './user-details.component.scss' ]
})
export class UserDetailsComponent implements OnInit {

    username: string = '';
    user: User = { id: undefined, username: '', email: '', phoneNumber: '', address: '', imageId: 0, imageDataUrl: undefined };
    image: string = '';
    products: Product[] = [];
    nrOfItems: number = 0;

    constructor(
        private userService: UserService,
        private toastNotify: ToastrService,
        private route: ActivatedRoute,
        private imageService: ImageService,
        private viewPortScroller: ViewportScroller,
        private productService: ProductService
    ) {
    }

    scrollToPagePart(elementId: string): void {
        this.viewPortScroller.scrollToAnchor(elementId);
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
                    if (data.imageId) {
                        this.loadImage(data.imageId);
                    }
                    const params: Params = { userId: data.id };
                    this.productService.getAllByParams(params).subscribe({
                        next: (data: ProductPage): void => {
                            this.products = data.products;
                            this.nrOfItems = data.nrOfElements;
                        },
                        error: (): void => {
                            this.toastNotify.error(`Error fetching data`);
                        }
                    });
                },
                error: (): void => {
                    this.toastNotify.error(`Error fetching data`);
                }
            });
        }
    }

    loadImage(imageId: number): void {
        if (imageId) {
            this.imageService.getImageFile(imageId).subscribe({
                next: (blob: Blob): void => {
                    const reader: FileReader = new FileReader();
                    reader.onload = (): void => {
                        this.user.imageDataUrl = reader.result as string;
                    };
                    if (blob) {
                        reader.readAsDataURL(blob);
                    }
                },
                error: (error): void => {
                    this.toastNotify.error(`Error fetching image`, error);
                }
            });
        }
    }
}
