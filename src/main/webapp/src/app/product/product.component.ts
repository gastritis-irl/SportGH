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
    nrOfPages: number = 0;
    nrOfItems: number = 0;
    filterParams: Params = this.getDefaultParams();
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
                    for (const paramName of this.filterParamNames) {
                        if (params[paramName]) {
                            this.filterParams[paramName] = params[paramName];
                        }
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
        this.filterParams['pageNumber'] = pageNumber;
        this.loadData();
    }

    orderBy(orderBy: string): void {
        this.filterParams['orderBy'] = orderBy.split('#')[0];
        this.filterParams['direction'] = orderBy.split('#')[1];
        this.loadData();
    }

    filterBy(filterParams: Params): void {
        this.filterParams = filterParams;
        this.loadData();
    }

    clearFilter(paramNameAndItem: [ string, string ]): void {
        if (this.filterParams[paramNameAndItem[0]].length
            && typeof this.filterParams[paramNameAndItem[0]] != 'string') {
            if (this.filterParams[paramNameAndItem[0]].length == 1) {
                this.filterParams[paramNameAndItem[0]] = this.getDefaultParams()[paramNameAndItem[0]];
            } else {
                for (let i: number = 0; i < this.filterParams[paramNameAndItem[0]].length; i++) {
                    if (this.filterParams[paramNameAndItem[0]][i] == paramNameAndItem[1]) {
                        this.filterParams[paramNameAndItem[0]].splice(i, 1);
                    }
                }
            }
        } else {
            this.filterParams[paramNameAndItem[0]] = this.getDefaultParams()[paramNameAndItem[0]];
        }
        this.loadData();
    }

    resetFilters(): void {
        this.filterParams = this.getDefaultParams();
        this.loadData();
    }

    getDefaultParams(): Params {
        return {
            pageNumber: 1,
            orderBy: 'name',
            direction: 'ASC',
            Category: [],
            Subcategory: [],
        };
    }
}
