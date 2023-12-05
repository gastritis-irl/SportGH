import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ImageService } from '../../shared/image/image.service';
import { Product } from '../../product/product.model';
import { ProductService } from '../../product/product.service';
import { ProductPage } from '../../product/product-page.model';
import { FirebaseIdTokenService } from '../../auth-and-token/firebase-id-token.service';

@Component({
    selector: 'sgh-user',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

    username: string = '';
    user: User = { imageId: 0 };
    image: string = '';
    products: Product[] = [];
    nrOfItems: number = 0;
    nrOfPages: number = 0;

    constructor(
        private userService: UserService,
        private toastNotify: ToastrService,
        private route: ActivatedRoute,
        private imageService: ImageService,
        private productService: ProductService,
        private router: Router,
    ) {
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
        if (uid === 'profile') {
            uid = FirebaseIdTokenService.getDecodedIdToken()?.user_id;
        }
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
                            this.nrOfPages = data.nrOfPages;
                            this.loadProductImages(this.products);
                        },
                        error: (): void => {
                            this.toastNotify.error(`Error fetching data`);
                        }
                    });
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

    loadImage(imageId: number): void {
        if (imageId !== 0) {
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

    loadProductImages(products: Product[]): void {
        for (const product of products) {

            if (!product.id) {
                continue;
            }
            this.imageService.getImageFilesByProductId(product.id).subscribe({
                next: (response: { name: string, data: Uint8Array }[]): void => {
                    if (!response) {
                        return;
                    }
                    try {
                        product.imageDataUrls = [];
                        for (const imageDTO of response) {
                            if (!imageDTO.data) {
                                continue;
                            }

                            const base64String: Uint8Array = imageDTO.data;
                            const imageUrl: string = 'data:image/jpeg;base64,' + base64String;
                            product.imageDataUrls.push(imageUrl);
                        }
                        product.imagesLoaded = true;
                    } catch (error) {
                        this.toastNotify.error(`Error loading images: ${error}`);
                    }
                },
                error: (error): void => {
                    this.toastNotify.error(`Error fetching images`, error);
                }
            });
        }
    }
}
