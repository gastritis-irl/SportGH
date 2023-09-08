import { Component, Input, OnInit } from '@angular/core';
import { Category } from '../../category/category.model';
import { Subcategory } from '../../subcategory/subcategory.model';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NgForOf, NgIf } from '@angular/common';

@Component({
    selector: 'sgh-tree-view',
    standalone: true,
    imports: [ NgForOf, NgIf, NgbCollapse ],
    templateUrl: './tree-view.component.html',
    styleUrls: [ './tree-view.component.scss' ],
})
export class TreeViewComponent implements OnInit {

    @Input() categories: Category[] = [];
    @Input() subcategories: Subcategory[] = [];
    categorySelected: boolean[] = [];
    @Input() selectedAtLeastOneSubCatOfCat: boolean[] = [];
    @Input() subcategorySelected: boolean[] = [];
    isExpanded: boolean[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }

    checkIfAllSubcategorySelected(catInd: number): boolean {
        for (let i: number = 0; i < this.subcategories.length; i++) {
            if (this.categories[catInd].id == this.subcategories[i].categoryId
                && !this.subcategorySelected[i]) {
                return false;
            }
        }
        return true;
    }

    checkIfSelectedAtLeastOneSubOfCat(catInd: number): boolean {
        for (let i: number = 0; i < this.subcategories.length; i++) {
            if (this.categories[catInd].id == this.subcategories[i].categoryId
                && this.subcategorySelected[i]) {
                return true;
            }
        }
        return false;
    }

    setValueForAllSubOfCat(catInd: number, value: boolean): void {
        for (let i: number = 0; i < this.subcategories.length; i++) {
            if (this.subcategories[i].categoryId == this.categories[catInd].id) {
                this.subcategorySelected[i] = value;
            }
        }
    }

    selectCategory(catInd: number): void {
        this.categorySelected[catInd] = !this.categorySelected[catInd];
        this.setValueForAllSubOfCat(catInd, this.categorySelected[catInd]);
        this.selectedAtLeastOneSubCatOfCat[catInd] = this.checkIfSelectedAtLeastOneSubOfCat(catInd);
    }

    selectSubcategory(subInd: number, catInd: number): void {
        this.subcategorySelected[subInd] = !this.subcategorySelected[subInd];
        this.selectedAtLeastOneSubCatOfCat[catInd] = this.checkIfSelectedAtLeastOneSubOfCat(catInd);
        this.categorySelected[catInd] = this.selectedAtLeastOneSubCatOfCat[catInd] || this.checkIfAllSubcategorySelected(catInd);
    }
}
