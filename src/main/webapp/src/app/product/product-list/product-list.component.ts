import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../product.model';
import { ImageService } from '../../shared/image/image.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'sgh-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {

    @Input() products: Product[] = [];
    @Output() newPageEvent: EventEmitter<number> = new EventEmitter<number>();
    currentPage: number = 1;
    @Input() nrOfPages: number = 1;
    @Input() nrOfItems: number = 0;

    constructor(private imageService: ImageService) {
    }

    ngOnInit(): void {
        this.products.forEach(product => {
            if (product.imageIds && product.imageIds.length > 0) {
                this.loadProductImages(product.imageIds.slice(0, 8), product);
            }
        });
    }

    loadProductImages(imageIds: number[], product: Product): void {
        const loadObservables = imageIds.map(id => this.imageService.getImageFile(id));

        forkJoin(loadObservables).subscribe({
            next: (blobs) => {
                blobs.forEach((blob, index) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (!product.imageDataUrls) {
                            product.imageDataUrls = [];
                        }
                        product.imageDataUrls[index] = reader.result as string;
                    };
                    if (blob) {
                        reader.readAsDataURL(blob);
                    }
                });
            },
            error: (error) => {
                console.error(`Error fetching images`, error);
            }
        });
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
