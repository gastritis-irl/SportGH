import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Params } from '@angular/router';
import { Category } from '../../category/category.model';
import { Subcategory } from '../../subcategory/subcategory.model';

@Component({
    selector: 'sgh-product-filter',
    templateUrl: './product-filter.component.html',
    styleUrls: [ './product-filter.component.scss' ],
})
export class ProductFilterComponent implements OnInit {

    isCollapsed: boolean[] = [];
    @Output() newFilterEvent: EventEmitter<[ string, string ]> = new EventEmitter<[ string, string ]>();
    filterParams: [ string, string ] = [ '', '' ];
    paramOptions: Params = [];
    @Input() paramNames: string[] = [];
    @Input() paramData: Params = [];

    constructor() {
    }

    ngOnInit(): void {
    }

    filterBy(): void {
        this.loadParams();
        this.newFilterEvent.emit(this.filterParams);
    }

    loadParams(): void {
        // delete first element: '',''
        this.filterParams.splice(0, 2);
        this.paramNames.forEach(
            (param: string): void => {
                if (this.paramOptions[param]) {
                    this.filterParams.push(param, this.paramOptions[param]);
                }
            }
        );
    }

    getParamData(param: string): Category[] | Subcategory[] {
        return this.paramData[param];
    }
}
