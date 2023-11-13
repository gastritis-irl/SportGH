import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../category/category.model';
import { CategoryService } from '../../category/category.service';
import { Subcategory } from '../../subcategory/subcategory.model';
import { SubcategoryService } from '../../subcategory/subcategory.service';
import { FirebaseIdTokenService } from '../../auth-and-token/firebase-id-token.service';
import { IdToken } from '../../auth-and-token/firebase-id-token.model';
import { Image } from '../../shared/image/image.model';
import { ImageService } from '../../shared/image/image.service';
import { ImageComponent } from '../../shared/image/image.component';
import * as L from 'leaflet';
import * as opencage from 'opencage-api-client';
import { environment } from '../../environment';

type ClickHandlerFunction = () => void;

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
    selector: 'sgh-product-post',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent implements OnInit {

    @ViewChild(ImageComponent, { static: false }) imageComponent?: ImageComponent;

    product: Product = {};
    categories: Category[] = [];
    subcategories: Subcategory[] = [];
    subcategoryDropdownDisabled: boolean = true;
    clickHandlerFunction: ClickHandlerFunction = (): void => {
    };
    editMode: boolean = false;
    modeParam: 'create' | 'edit' = 'create';
    buttonPushed: boolean = false;
    _imageIds?: number[];
    newImageFiles: File[] = [];
    imageDatas: Image[] = [];

    marker: L.Marker = new L.Marker([45.9442858, 25.0094303]);
    markerAddress: string = 'Romania,Cluj-Napoca';
    map: L.Map | undefined;
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
        private categoryService: CategoryService,
        private subcategoryService: SubcategoryService,
        private fbIdTokenService: FirebaseIdTokenService,
        private router: Router,
        private route: ActivatedRoute,
        private toastNotify: ToastrService,
        private imageService: ImageService,
    ) {
    }

    ngOnInit(): void {
        this.categoryService.getAll().subscribe(
            {
                next: (data: Category[]): void => {
                    this.categories = data;
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error loading categories`);
                }
            }
        );
        this.loadDataByParam();
    }

    onMapReady(map: L.Map): void {
        this.map = map;
        this.marker = new L.Marker(this.marker.getLatLng(), {
            icon: L.icon({
                iconUrl: 'assets/blue-marker.svg',
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            })
        }).addTo(map);
    }

    resetMarkerOnMap(): void {
        if (this.product.locationLat && this.product.locationLng) {
            this.marker.setLatLng(new L.LatLng(this.product.locationLat, this.product.locationLng));
        }
        this.map?.setView(this.marker.getLatLng());
    }

    moveMarkerToNewPosition(event: L.LeafletMouseEvent): void {
        this.marker.setLatLng(L.latLng(event.latlng.lat, event.latlng.lng));
        this.product.locationLat = this.marker.getLatLng().lat;
        this.product.locationLng = this.marker.getLatLng().lng;
        this.resetMarkerOnMap();
    }

    getLocationAddress(): void {
        opencage.geocode({
            q: `${this.marker.getLatLng().lat}, ${this.marker.getLatLng().lng}`,
            key: environment.geocodingApiKey,
            language: 'en'
        })
            .then((data: GeocodeResponse): void => {
                this.markerAddress = data.results[0].formatted;
            })
            .catch((error): void => {
                console.error(error);
                this.toastNotify.error('Error fetching location');
            });
    }

    getLocationCoordinates(): void {
        opencage.geocode({
            q: this.markerAddress,
            key: environment.geocodingApiKey,
            language: 'en'
        })
            .then((data: GeocodeResponse): void => {
                this.product.locationLat = data.results[0].geometry.lat;
                this.product.locationLng = data.results[0].geometry.lng;
                this.marker.setLatLng(new L.LatLng(this.product.locationLat, this.product.locationLng));
                this.resetMarkerOnMap();
            })
            .catch((error): void => {
                console.error(error);
                this.toastNotify.error('Error fetching location');
            });
    }

    onFileChange(files: File[]): void {
        this.newImageFiles = files;
    }

    onFileRemoved(file: File): void {
        this.newImageFiles = this.newImageFiles.filter(f => f !== file);
    }

    loadDataByParam(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.loadData(params['productId']);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }

    loadData(param: string | undefined): void {
        if (!param) {
            this.clickHandlerFunction = this.createProduct;
            this.editMode = false;
            this.modeParam = 'create';
        } else {
            const id: number = parseInt(param);
            if (!isNaN(id)) {
                this.modeParam = 'edit';
                this.clickHandlerFunction = this.editProduct;
                this.editMode = true;

                this.productService.getById(id).subscribe(
                    {
                        next: (data: Product): void => {
                            this.product = data;
                            if (data.locationLat && data.locationLng) {
                                this.marker.setLatLng(new L.LatLng(data.locationLat, data.locationLng));
                                this.resetMarkerOnMap();
                            }
                            this.subcategoryDropdownDisabled = false;
                            this.getSubcategoriesByCategoryId();
                            // Call the loadProductImages method here
                            if (data.id) {
                                this.loadProductImageIds(data.id);
                            } else {
                                this.toastNotify.error(`Error loading images: ${data.id} is undefined`);
                            }
                        },
                        error: (error): void => {
                            console.error(error);
                            this.toastNotify.error(`Error fetching data`);
                        }
                    }
                );
            }
        }
    }


    loadProductImageIds(productId: number): void {
        this.imageService.getImageIdsByProductId(productId).subscribe({
            next: (response: Image[]): void => {
                try {
                    this._imageIds = response.map(image => image.id).filter(id => id !== undefined) as number[];
                } catch (error) {
                    this.toastNotify.error(`Error loading images: ${error}`);
                }
            },
            error: (): void => {
            }
        });
    }

    getSubcategoriesByCategoryId(): void {
        this.subcategoryService.getByCategoryId(this.product.categoryId ? this.product.categoryId : 0).subscribe(
            {
                next: (data: Subcategory[]): void => {
                    this.subcategories = data;
                    this.subcategoryDropdownDisabled = false;
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error loading subcategories`);
                }
            }
        );
    }

    createProduct(): void {
        const idToken: IdToken | null = this.fbIdTokenService.getDecodedIdToken();
        if (!idToken) {
            this.toastNotify.warning('Please log in first.');
            return;
        } else {
            this.product.userUid = idToken.user_id;
        }
        this.buttonPushed = true;
        this.product.publicContact = true;

        this.productService.create(this.product).subscribe(
            {
                next: (resp: Product): void => {

                    if (this.newImageFiles.length > 0) {
                        if (resp.id) {
                            this.uploadImages(resp.id, this.newImageFiles);
                        }
                    }

                    this.router.navigate([`/products/${resp.id}`])
                        .catch((error: string): void => {
                            console.error(error);
                            this.toastNotify.info('Error redirecting to page');
                        });
                },
                error: (): void => {
                    this.toastNotify.warning('Error creating product');
                }
            }
        );
    }

    uploadImages(productId: number, files: File[]): void {
        files.forEach((file, index) => {
            if (file) {
                this.imageService.uploadImage(file, productId).subscribe({
                    next: (image: Image) => {
                        this.imageDatas[index] = image;
                    },
                    error: (error) => {
                        console.error(error);
                        this.toastNotify.error(`Error uploading image ${index + 1}`);
                    }
                });
            }
        });
    }

    editProduct(): void {
        this.buttonPushed = true;
        this.productService.edit(this.product).subscribe(
            {
                next: (resp: Product): void => {
                    this.router.navigate([`/products/${resp.id}`])
                        .catch((error: string): void => {
                            console.error(error);
                            this.toastNotify.info('Error redirecting to page');
                        });
                },
                error: (): void => {
                    this.toastNotify.warning('Error editing product');
                }
            }
        );

        if (this.newImageFiles.length > 0) {
            if (this.product.id) {
                this.uploadImages(this.product.id, this.newImageFiles);
            }
        }
    }

    cancelEdit(route: string): void {
        this.router.navigate([route])
            .catch((error): void => {
                console.error(error);
                this.toastNotify.error('Error redirecting to page');
            });
    }
}
