import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../user/user.model';
import { ViewportScroller } from '@angular/common';

@Component({
    selector: 'sgh-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: [ './product-details.component.scss' ],
})
export class ProductDetailsComponent implements OnInit {

    product: Product = {};
    dateFrom: Date | string = new Date('0001-01-01');
    dateTo: Date | string = new Date('0001-01-01');

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router,
        private viewPortScroller: ViewportScroller,
        private toastNotify: ToastrService,
    ) {
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
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
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

    getOwnerInfo(): void {
        if (this.product.publicContact) {
            // load modal with owner's data
            this.productService.getOwnerInfo(this.product).subscribe({
                next: (user: User): void => {
                    this.toastNotify.success(`Owner info: ${user.username}`);
                },
                error: (error): void => {
                    this.toastNotify.error(error.error);
                }
            });
        } else {
            this.productService.sendContactRequest(this.product).subscribe({
                next: (): void => {
                    this.toastNotify.info('Request sent successfully.');
                },
                error: (error): void => {
                    this.toastNotify.warning(error.error);
                }
            });
        }
    }

    deleteProduct(): void {
        this.productService.delete(this.product.id ? this.product.id : 0).subscribe(
            {
                next: (): void => {
                    this.toastNotify.success(`Product ${this.product.name} successfully deleted!`);
                    this.router.navigate([ `/products` ])
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
