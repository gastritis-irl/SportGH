import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../product.model';
import { ImageService } from '../../shared/image/image.service';
import { Subcategory } from '../../subcategory/subcategory.model';
import { Category } from '../../category/category.model';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'sgh-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: [ './product-list.component.scss' ],
})
export class ProductListComponent implements OnChanges {

    @Input() products: Product[] = [];
    @Input() categories: Category[] = [];
    @Input() subcategories: Subcategory[] = [];
    @Input() subcategorySelected: boolean[] = [];
    @Input() categorySelected: boolean[] = [];
    @Input() textSearch: string = '';
    @Input() minPrice: number = 0;
    @Input() maxPrice: number = 0;
    @Input() nrOfPages: number = 0;
    @Input() nrOfItems: number = 0;
    currentPage: number = 1;
    orderByElement: string = 'name#ASC';

    @Output() newPageEvent: EventEmitter<number> = new EventEmitter<number>();
    @Output() orderByEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() clearFilterEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() resetFilterEvent: EventEmitter<string> = new EventEmitter<string>();

    constructor(private imageService: ImageService, private toastNotify: ToastrService, private cdr: ChangeDetectorRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['products'] && changes['products'].currentValue) {
            this.loadProductImages(changes['products'].currentValue);
        }
    }


    loadProductImages(products: Product[]): void {
        for (const product of products) {
            this.toastNotify.info(`Loading images...`);

            if (!product.id) {
                continue;
            }
            this.imageService.getImageFilesByProductId(product.id).subscribe({
                next: (response: { name: string, data: Uint8Array }[]) => {
                    this.toastNotify.info(`Images loaded.`);
                    this.toastNotify.info(`Size of response: ${response.length}`);
                    try {
                        product.imageDataUrls = [];
                        for (const imageDTO of response) {
                            if (!imageDTO.data) {
                                continue;
                            }
                            const base64String = btoa(new TextDecoder('iso-8859-1').decode(new Uint8Array(imageDTO.data)));
                            const imageUrl = 'data:image/jpeg;base64,' + base64String;
                            product.imageDataUrls.push(imageUrl);
                        }
                        product.imagesLoaded = true;  // Set imagesLoaded to true here
                        this.toastNotify.success(`Images successfully loaded.`);
                        this.cdr.markForCheck();  // Tell Angular to check for changes
                    } catch (error) {
                        this.toastNotify.error(`Error loading images: ${error}`);
                    }
                },
                error: (error) => {
                    this.toastNotify.error(`Error fetching images`, error);
                }
            });
        }
    }

    resetFilters(): void {
        this.resetFilterEvent.emit();
    }

    clearFilter(paramName: string, paramIndex: number): void {
        this.subcategorySelected[paramIndex] = false;
        let checkedSubWithSameCat: boolean = false;
        for (let i: number = 0; i < this.subcategories.length; i++) {
            if (this.subcategories[i].categoryId == this.subcategories[paramIndex].categoryId
                && this.subcategorySelected[i]) {
                checkedSubWithSameCat = true;
                break;
            }
        }
        if (!checkedSubWithSameCat) {
            for (let i: number = 0; i < this.categories.length; i++) {
                if (this.categories[i].id == this.subcategories[paramIndex].categoryId) {
                    this.categorySelected[i] = false;
                    break;
                }
            }
        }

        this.clearFilterEvent.emit(paramName);
    }

    anyActiveFilter(): boolean {
        return this.textSearch != '' ||
            this.minPrice != 0 ||
            this.maxPrice != 0 ||
            this.subcategorySelected.find((e: boolean) => e) != null;
    }

    orderBy(): void {
        this.orderByEvent.emit(this.orderByElement);
    }

    navToPage(): void {
        this.newPageEvent.emit(this.currentPage);
    }

    selectPage(currentPage: number): void {
        this.currentPage = currentPage;
        this.navToPage();
    }

    nextPage(): void {
        this.currentPage++;
        this.navToPage();
    }

    previousPage(): void {
        this.currentPage--;
        this.navToPage();
    }

    range(from: number, to: number): number[] {
        if (from > to) {
            return [];
        }
        const result: number[] = [];
        for (let i: number = from; i <= to; i++) {
            result.push(i);
        }
        return result;
    }
}
