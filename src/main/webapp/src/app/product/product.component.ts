import { Component, OnChanges, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductPage } from './product-page.model';

@Component({
    selector: 'sgh-product',
    templateUrl: './product.component.html',
    styleUrls: [ './product.component.scss' ],
})
export class ProductComponent implements OnInit, OnChanges {

    products: Product[] = [];
    currentPage: number = 1;
    nrOfPages: number = 5;
    nrOfItems: number = 0;
    orderByElement: string = 'name';
    filterParams: [ string, string ] = [ '', '' ];

    constructor(private productService: ProductService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.loadDataByParam();
    }

    ngOnChanges(): void {
        this.loadDataByParam();
    }

    loadParams(params: Params, param: string[]): void {
        // delete first element: '',''
        this.filterParams.splice(0, 2);
        param.forEach(
            (p: string): void => {
                if (params[p]) {
                    this.filterParams.push(p, params[p]);
                }
            }
        );
    }

    loadData(): void {
        this.productService.getAllByParams(this.currentPage, this.orderByElement, this.filterParams).subscribe(
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

    loadDataByParam(): void {
        this.scrollToTop();
        this.route.queryParams.subscribe(
            {
                next: (params: Params): void => {
                    this.loadParams(params, [
                        'categoryId',
                        'name',
                        'priceMin',
                        'priceMax',
                    ]);
                    this.loadData();
                },
                error: (error): void => {
                    console.error('Error fetching data (categoryId):', error);
                }
            }
        );
    }

    scrollToTop(): void {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        });
    }

    setPageNumber(pageNumber: number): void {
        this.currentPage = pageNumber;
    }

    orderBy(orderByElement: string): void {
        this.orderByElement = orderByElement;
    }

    filterBy(filterParams: [ string, string ]): void {
        this.filterParams = filterParams;
    }
}
