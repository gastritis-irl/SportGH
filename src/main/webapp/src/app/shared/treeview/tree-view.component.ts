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
    isCollapsed: boolean[] = [];

    constructor() {
    }

    ngOnInit(): void {
        for (let i: number = 0; i < this.categories.length; i++) {
            this.isCollapsed[i] = true;
        }
    }
}
