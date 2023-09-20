import { Component, OnInit, TemplateRef } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../user/user.model';
import { ViewportScroller } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'sgh-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {

    product: Product = {};
    owner: User = {};
    dateFrom: Date | string = new Date('0001-01-01');
    dateTo: Date | string = new Date('0001-01-01');

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router,
        private viewPortScroller: ViewportScroller,
        private toastNotify: ToastrService,
        private modalService: NgbModal,
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

    getOwnerInfo(modalContent: TemplateRef<string>): void {
        // load modal with owner's data
        this.productService.getOwnerInfo(this.product).subscribe({
            next: (user: User): void => {
                this.owner = user;
                this.modalService.dismissAll();
                this.modalService.open(modalContent, { centered: true, scrollable: true, animation: true });
                this.toastNotify.success(`Owner info: ${user.username}`);
            },
            error: (error): void => {
                if (error.statusText === 'Unauthorized') {
                    this.productService.sendContactRequest(this.product).subscribe({
                        next: (): void => {
                            this.toastNotify.info('Request sent successfully.');
                        },
                        error: (error): void => {
                            this.toastNotify.warning(error.error);
                        }
                    });
                } else {
                    this.toastNotify.error(error.error);
                }
            }
        });
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
