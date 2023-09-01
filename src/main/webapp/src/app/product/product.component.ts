import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductPage } from './product-page.model';

@Component({
    selector: 'sgh-product',
    templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {

    products: Product[] = [];
    currentPage: number = 1;
    nrOfPages: number = 5;
    nrOfItems: number = 0;
    categoryId: number = 0;

    constructor(private productService: ProductService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.loadDataByParam();
    }

    loadDataByParam(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.categoryId = params['categoryId'];
                    this.loadData();
                },
                error: (error): void => {
                    console.error('Error fetching data (categoryId):', error);
                }
            }
        );
    }

    loadData(): void {
        this.productService.getByCategoryId(this.categoryId, this.currentPage).subscribe(
            {
                next: (data: ProductPage): void => {
                    this.products = data.products;
                    this.nrOfPages = data.nrOfPages;
                    this.nrOfItems = data.nrOfItems;
                },
                error: (error): void => {
                    console.error('Error fetching data (products):', error);
                }
            }
        );
    }

    setPageNumber(pageNumber: number): void {
        this.currentPage = pageNumber;
        this.loadData();
    }
}
