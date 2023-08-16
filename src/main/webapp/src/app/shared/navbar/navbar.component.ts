import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { AuthModule } from '../../authentication/authentication.module';

import { NgForOf } from '@angular/common';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/category.model';

@Component({
    selector: 'sgh-navbar',
    standalone: true,
    imports: [NgbDropdownModule, RouterLink, AuthModule, NgForOf],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.scss'],
})
export class NavbarComponent implements OnInit {

    categories: Category[] = [];

    constructor(private categoryService: CategoryService) {
    }

    ngOnInit(): void {
        this.categoryService.getAll().subscribe(
            {
                next: (data: Category[]): void => {
                    this.categories = data;
                },
                error: (error): void => {
                    console.error(error);
                }
            }
        );
    }
}
