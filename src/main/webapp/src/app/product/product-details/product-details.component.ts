import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { ViewportScroller } from '@angular/common';
import { Image } from '../../shared/image/image.model';
import { ImageService } from '../../shared/image/image.service';

import { ViewChild } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'sgh-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {

    @ViewChild(NgbCarousel) carousel!: NgbCarousel;

    product: Product = {};
    productLender: User = { id: undefined, username: '', email: '', phoneNumber: '', address: '', imageId: 0, imageDataUrl: undefined };
    imageDatas: Image[] = [];
    dateFrom: Date | string = new Date('0001-01-01');
    dateTo: Date | string = new Date('0001-01-01');

    constructor(
        private productService: ProductService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private viewPortScroller: ViewportScroller,
        private toastNotify: ToastrService,
        private imageService: ImageService,
    ) {
    }

    loadProductImages(productId: number): void {

        this.imageService.getImageFilesByProductId(productId).subscribe({
            next: async (response: {name:string, data:Uint8Array}[]) => {
                try {
                    const imageDTOs: Image[] = response;
                    this.product.imageDataUrls = [];

                    if (!imageDTOs || imageDTOs.length === 0) {
                        return;
                    }
                    for (const imageDTO of imageDTOs) {
                        if (!imageDTO.data) {
                            continue;
                        }

                        const base64String = imageDTO.data
                        const imageUrl = 'data:image/jpeg;base64,' + base64String;
                        this.product.imageDataUrls.push(imageUrl);
                    }

                } catch (error) {
                    this.toastNotify.error(`Error loading images: ${error}`);
                }
            },
            error: (error) => {
                this.toastNotify.error(`Error fetching images`, error);
            }
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.loadProduct(params['productId']);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }

    loadProduct(productId: number): void {
        this.productService.getById(productId).subscribe(
            {
                next: (data: Product): void => {
                    this.product = data;
                    this.loadProductLender(this.product.userId ? this.product.userId : 0);
                    this.loadProductImages(this.product.id ? this.product.id : 0);

                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }

    loadProductLender(userId: number): void {
        this.userService.getById(userId).subscribe(
            {
                next: (resp: User): void => {
                    this.productLender = resp;
                },
                error: (): void => {
                    this.toastNotify.error(`Error loading lender info`);
                }
            }
        );
    }

    getTimeIn(date: number, format: string): number {
        switch (format) {
            case 'h': {
                return date / 3600000;
            }
            case 'd': {
                return date / 86400000;
            }
            case 'w': {
                return date / 604800000;
            }
            default: {
                return date / 86400000;
            }
        }
    }

    showTotalPrice(date1: string | Date, date2: string | Date, format: string): number {
        date1 = new Date(date1);
        date2 = new Date(date2);

        if (date2 < date1 || date1 < new Date()) {
            return 0;
        }

        const date: number = date2.getTime() - date1.getTime();
        const timeIn: number = this.getTimeIn(date, format);
        const totalPrice: number = timeIn * (this.product.rentPrice ? this.product.rentPrice : 0);

        return totalPrice < 0 ? 0 : totalPrice;
    }

    scrollToPagePart(elementId: string): void {
        this.viewPortScroller.scrollToAnchor(elementId);
    }

    rentProduct(): void {
        this.productService.rent(this.product.id ? this.product.id : 0).subscribe(
            {
                next: (data: Product): void => {
                    this.product = data;
                    this.toastNotify.success(`Product successfully rented`);
                },
                error: (error): void => {
                    this.toastNotify.error(`Error renting product: ${error.error}`);
                }
            }
        );
    }

    deleteProduct(): void {
        this.productService.delete(this.product.id ? this.product.id : 0).subscribe(
            {
                next: (): void => {
                    this.toastNotify.success(`Product ${this.product.name} successfully deleted!`);
                    this.router.navigate([`/products`])
                        .catch((error): void => {
                            console.error(error);
                            this.toastNotify.error('Error redirecting to page');
                        });
                },
                error: (error): void => {
                    this.toastNotify.error(`Error deleting product: ${error.error}`);
                }
            }
        );
    }
}
