import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'sgh-product',
    templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {

    products: Product[] = [];
    pageNumber: number = 1;
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
        this.productService.getByCategoryId(this.categoryId, this.pageNumber).subscribe(
            {
                next: (data: Product[]): void => {
                    this.products = data;
                },
                error: (error): void => {
                    console.error('Error fetching data (products):', error);
                }
            }
        );
    }

    setPageNumber(pageNumber: number): void {
        this.pageNumber = pageNumber;
        this.loadData();
    }
}
