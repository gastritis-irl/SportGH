import { Component, OnInit, TemplateRef } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../user/user.model';
import { ViewportScroller } from '@angular/common';
import { FirebaseIdTokenService } from '../../auth-and-token/firebase-id-token.service';
import { Image } from '../../shared/image/image.model';
import { ImageService } from '../../shared/image/image.service';
import { ViewChild } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import { LatLng } from 'leaflet';
import * as opencage from 'opencage-api-client';
import { environment } from '../../environment';

// opencage geocode api
// q: request param / query param (coordinates or address)
// key: api key from opencage
// language: address format

// opencage geocode api response format part
type GeocodeResponse = {
    results: {
        components: {
            _category?: string;
            _type?: string;
            continent?: string;
            country?: string;
            country_code?: string;
            county?: string;
            political_union?: string;
            postcode?: string;
            road?: string;
            road_reference?: string;
            road_type?: string;
            village?: string;
        },
        formatted: string,
        geometry: {
            lat: number;
            lng: number;
        },
    }[];
}

@Component({
    selector: 'sgh-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {

    @ViewChild(NgbCarousel) carousel!: NgbCarousel;

    product: Product = {};
    owner: User = { imageId: 0 };
    dateFrom: Date | string = new Date('0001-01-01');
    dateTo: Date | string = new Date('0001-01-01');

    marker: L.Marker = new L.Marker([45.9442858, 25.0094303]);
    location: string = '';
    map?: L.Map;
    options: L.MapOptions = {
        layers: [
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
            })
        ],
        zoom: 10,
        center: L.latLng(this.marker.getLatLng().lat, this.marker.getLatLng().lng)
    };

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router,
        private viewPortScroller: ViewportScroller,
        private toastNotify: ToastrService,
        private fbIdTokenService: FirebaseIdTokenService,
        private imageService: ImageService,
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

    // recenter map to marker (setView to marker's position)
    resetMarkerOnMap(): void {
        if (this.product.locationLat && this.product.locationLng) {
            this.marker.setLatLng(new LatLng(this.product.locationLat, this.product.locationLng));
            this.getLocationAddress();
        }
        this.map?.setView(this.marker.getLatLng());
    }

    // sync with leaflet 'map' after it has been loaded and add marker to map
    onMapReady(map: L.Map): void {
        this.map = map;
        this.marker = new L.Marker(this.marker.getLatLng(), {
            icon: L.icon({
                iconUrl: 'main/webapp/src/assets/blue-marker.svg',
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            })
        }).addTo(map);
    }

    loadProductImages(productId: number): void {
        this.imageService.getImageFilesByProductId(productId).subscribe({
            next: async (response: { name: string, data: Uint8Array }[]) => {
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

                        const base64String = imageDTO.data;
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

    // request address by coordinates (opencage geocode api)
    getLocationAddress(): void {
        opencage.geocode({
            q: `${this.marker.getLatLng().lat}, ${this.marker.getLatLng().lng}`,
            key: environment.geocodingApiKey,
            language: 'en'
        })
            .then((data: GeocodeResponse): void => {
                this.location = data.results[0].formatted;
            })
            .catch((error): void => {
                console.error(error);
                this.toastNotify.error('Error fetching location');
            });
    }

    getLoggedInUserUid(): string | null {
        const userId: string | undefined = this.fbIdTokenService.getDecodedIdToken()?.user_id;
        if (userId != undefined) {
            return userId;
        }
        return null;
    }

    loadProduct(productId: number): void {
        this.productService.getById(productId).subscribe(
            {
                next: (data: Product): void => {
                    this.product = data;
                    this.resetMarkerOnMap();
                    this.loadProductImages(this.product.id ? this.product.id : 0);
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
            },
            error: (error): void => {
                switch (error.status) {
                    case 302: { // Found / Pending
                        this.toastNotify.info('Request has already been sent.');
                        break;
                    }
                    case 303: { // See other / Declined
                        this.toastNotify.success('Request sent successfully!');
                        break;
                    }
                    case 301: { // Moved permanently / Created
                        this.toastNotify.success('Request sent successfully!');
                        break;
                    }
                    default: {  // Error
                        this.toastNotify.error(`Error fetching data: ${error.statusText}`);
                        this.toastNotify.error('Please try again.');
                    }
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
