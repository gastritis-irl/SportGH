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

    constructor(private productService: ProductService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.loadDataByParam();
    }

    loadDataByParam(): void {
        this.route.queryParams.subscribe(
            {
                next: (params: Params): void => {
                    if (params['categoryId']) {
                        this.loadDataByCategoryId(params['categoryId']);
                    } else {
                        this.loadData();
                    }
                },
                error: (error): void => {
                    console.error('Error fetching data (categoryId):', error);
                }
            }
        );
    }

    loadData(): void {
        this.productService.getAll(this.currentPage).subscribe(
            {
                next: (data: ProductPage): void => {
                    this.products = data.products;
                    this.nrOfPages = data.nrOfPages;
                    this.nrOfItems = data.nrOfElements;
                },
                error: (error): void => {
                    console.error('Error fetching data (products):', error);
                }
            }
        );
    }

    loadDataByCategoryId(categoryId: number): void {
        this.productService.getByCategoryId(categoryId, this.currentPage).subscribe(
            {
                next: (data: ProductPage): void => {
                    this.products = data.products;
                    this.nrOfPages = data.nrOfPages;
                    this.nrOfItems = data.nrOfElements;
                    console.log(data);
                },
                error: (error): void => {
                    console.error('Error fetching data (products):', error);
                }
            }
        );
    }

    setPageNumber(pageNumber: number): void {
        this.currentPage = pageNumber;
        window.scroll({
            top: 0,
            behavior: 'smooth'
        });
        this.loadDataByParam();
    }
}
