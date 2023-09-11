import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ProductPage } from './product-page.model';
import { Category } from '../category/category.model';
import { Subcategory } from '../subcategory/subcategory.model';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    selector: 'sgh-product',
    templateUrl: './product.component.html',
    styleUrls: [ './product.component.scss' ],
})
export class ProductComponent implements OnInit {

    products: Product[] = [];
    categories: Category[] = [];
    subcategories: Subcategory[] = [];
    nrOfPages: number = 0;
    nrOfItems: number = 0;
    currentPage: number = 1;
    orderByParam: string = 'name';
    direction: string = 'ASC';
    filterParams: Params = {
        pageNumber: 1,
        orderBy: 'name',
        direction: 'ASC',
        Subcategory: [],
        TextSearch: '',
        MinPrice: 0,
        MaxPrice: 0,
    };
    filterParamNames: string[] = [
        'pageNumber',
        'orderBy',
        'direction',
        'Category',
        'Subcategory',
        'MinPrice',
        'MaxPrice',
        'TextSearch'
    ];
    selectedAtLeastOneSubCatOfCat: boolean[] = [];
    categorySelected: boolean[] = [];
    subcategorySelected: boolean[] = [];
    textSearch: string = '';
    minPrice: number = 0;
    maxPrice: number = 0;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private subcategoryService: SubcategoryService,
        private toastNotify: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.loadDataFirst();
    }

    loadDataFirst(): void {
        this.categoryService.getAll().subscribe(
            {
                next: (data: Category[]): void => {
                    this.categories = data;
                    this.subcategoryService.getAll().subscribe(
                        {
                            next: (data: Subcategory[]): void => {
                                this.subcategories = data;
                                this.getQueryParams();
                            },
                            error: (error): void => {
                                console.error('Error fetching data(subcategories):', error);
                                this.toastNotify.error('Error loading filters');
                            }
                        }
                    );
                },
                error: (error): void => {
                    console.error('Error fetching data(categories):', error);
                    this.toastNotify.error('Error loading filters');
                }
            }
        );
    }

    changesEvent(changed: [ number, number ]): void {
        this.minPrice = changed[0];
        this.maxPrice = changed[1];
        this.setParams();
        this.loadData();
    }

    getQueryParams(): void {
        this.route.queryParams.subscribe(
            {
                next: (params: Params): void => {
                    for (const paramName of this.filterParamNames) {
                        if (params[paramName] && params[paramName] != 0) {
                            if (paramName == 'Subcategory') {
                                this.filterParams[paramName].push(params[paramName]);
                                for (let i: number = 0; i < this.subcategories.length; i++) {
                                    if (this.subcategories[i].name == params[paramName]) {
                                        this.subcategorySelected[i] = true;
                                    }
                                }
                            } else {
                                this.filterParams[paramName] = params[paramName];
                            }
                            if (paramName == 'Category') {
                                let catInd: number = -1;
                                for (let i: number = 0; i < this.categories.length; i++) {
                                    if (this.categories[i].name == params[paramName]) {
                                        catInd = i;
                                        break;
                                    }
                                }
                                if (catInd != -1) {
                                    this.categorySelected[catInd] = true;
                                }
                                for (let i: number = 0; i < this.subcategories.length; i++) {
                                    if (this.subcategories[i].categoryId == this.categories[catInd].id) {
                                        this.subcategorySelected[i] = true;
                                        this.filterParams['Subcategory'].push(this.subcategories[i].name);
                                    }
                                }
                            }
                            if (paramName == 'pageNumber') {
                                this.currentPage = params[paramName];
                            }
                            if (paramName == 'orderBy') {
                                this.orderByParam = params[paramName];
                            }
                            if (paramName == 'direction') {
                                this.direction = params[paramName];
                            }
                            if (paramName == 'TextSearch') {
                                this.textSearch = params[paramName];
                            }
                            if (paramName == 'MinPrice') {
                                this.minPrice = params[paramName];
                            }
                            if (paramName == 'MaxPrice') {
                                this.maxPrice = params[paramName];
                            }
                        }
                    }
                    this.loadData();
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error('Error loading filter parameters');
                }
            }
        );
    }

    setQueryParams(): void {
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                // queryParams: this.filterParams,
                replaceUrl: true,
                queryParamsHandling: 'merge'
            }
        )
            .catch(error => {
                console.error(error);
                this.toastNotify.error('Error loading filter parameters');
            });
    }

    loadData(): void {
        this.scrollToTop();
        this.setQueryParams();
        this.productService.getAllByParams(this.filterParams).subscribe(
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
    }

    scrollToTop(): void {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        });
    }

    setPageNumber(pageNumber: number): void {
        this.filterParams['pageNumber'] = pageNumber;
        this.loadData();
    }

    orderBy(orderBy: string): void {
        this.filterParams['orderBy'] = orderBy.split('#')[0];
        this.filterParams['direction'] = orderBy.split('#')[1];
        this.loadData();
    }

    clearFilter(paramName: string): void {
        if (paramName == 'TextSearch') {
            this.textSearch = '';
        }
        if (paramName == 'MinPrice') {
            this.minPrice = 0;
        }
        if (paramName == 'MaxPrice') {
            this.maxPrice = 0;
        }
        this.setParams();
        this.loadData();
    }

    resetFilters(): void {
        this.setDefaultParams();
        this.loadData();
    }

    setDefaultParams(): void {
        this.filterParams = {
            pageNumber: 1,
            orderBy: 'name',
            direction: 'ASC',
            Subcategory: [],
            TextSearch: '',
            MinPrice: 0,
            MaxPrice: 0,
        };
        this.currentPage = 1;
        this.orderByParam = 'name';
        this.direction = 'ASC';
        this.subcategorySelected = [];
        this.textSearch = '';
        this.minPrice = 0;
        this.maxPrice = 0;
    }

    setParams(): void {
        this.filterParams = [];
        this.filterParams = {
            pageNumber: this.currentPage,
            orderBy: this.orderByParam,
            direction: this.direction,
            Subcategory: [],
            TextSearch: this.textSearch,
            MinPrice: this.minPrice,
            MaxPrice: this.maxPrice,
        };

        for (let i: number = 0; i < this.subcategories.length; i++) {
            if (this.subcategorySelected[i]) {
                this.filterParams['Subcategory'].push(this.subcategories[i].name);
            }
        }
    }
}
