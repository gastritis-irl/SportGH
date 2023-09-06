import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ProductPage } from './product-page.model';
import { Category } from '../category/category.model';
import { Subcategory } from '../subcategory/subcategory.model';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'sgh-product',
    templateUrl: './product.component.html',
    styleUrls: [ './product.component.scss' ],
})
export class ProductComponent implements OnInit {

    products: Product[] = [];
    categories: Category[] = [];
    subcategories: Subcategory[] = [];
    currentPage: number = 1;
    nrOfPages: number = 0;
    nrOfItems: number = 0;
    orderByElement: string = 'name';
    filterParams: Params = {};
    filterParamNames: string[] = [
        'Category',
        'Subcategory',
        'Min Price',
        'Max Price'
    ];

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private subcategoryService: SubcategoryService,
        private toastNotify: ToastrService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.loadParams();
        this.loadData();
    }

    loadParams(): void {
        this.route.queryParams.subscribe(
            {
                next: (params: Params): void => {
                    if (params['categoryId']) {
                        this.filterParams['Category'] = params['categoryId'];
                    }
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error('Error loading filter parameters');
                }
            }
        );
    }

    loadData(): void {
        this.scrollToTop();
        this.productService.getAllByParams(
            this.currentPage,
            this.orderByElement,
            this.filterParams,
            this.filterParamNames
        ).subscribe(
            {
                next: (data: ProductPage): void => {
                    this.products = data.products;
                    this.nrOfPages = data.nrOfPages;
                    this.nrOfItems = data.nrOfElements;
                },
                error: (error): void => {
                    console.error('Error fetching data (products):', error);
                    this.toastNotify.error('Error loading products');
                }
            }
        );
        this.categoryService.getAll().subscribe(
            {
                next: (data: Category[]): void => {
                    this.categories = data;
                },
                error: (error): void => {
                    console.error('Error fetching data(categories):', error);
                    this.toastNotify.error('Error loading filters');
                }
            }
        );
        this.subcategoryService.getAll().subscribe(
            {
                next: (data: Subcategory[]): void => {
                    this.subcategories = data;
                },
                error: (error): void => {
                    console.error('Error fetching data(subcategories):', error);
                    this.toastNotify.error('Error loading filters');
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

    filterBy(filterParams: Params): void {
        this.filterParams = filterParams;
        this.loadData();
    }
}
