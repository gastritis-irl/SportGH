import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink } from '@angular/router';
import { AuthModule } from '../../authentication/authentication.module';

import { NgForOf, NgIf } from '@angular/common';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/category.model';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { FirebaseIdTokenService } from '../../auth-and-token/firebase-id-token.service';
import { IdToken } from '../../auth-and-token/firebase-id-token.model';

@Component({
    selector: 'sgh-navbar',
    standalone: true,
    imports: [NgbDropdownModule, RouterLink, AuthModule, NgForOf, NgIf, FormsModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

    categories: Category[] = [];
    textSearch: string = '';

    constructor(
        private categoryService: CategoryService,
        private toastNotify: ToastrService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.categoryService.getAll().subscribe(
            {
                next: (data: Category[]): void => {
                    this.categories = data;
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error loading categories into navbar`);
                }
            }
        );
    }

    searchForText(): void {
        this.router.navigate(['/products'], { queryParams: { pageNumber: 1, textSearch: this.textSearch } })
            .then(() => this.textSearch = '')
            .catch(error => {
                console.error(error);
                this.toastNotify.error(`Error searching for ${this.textSearch}`);
            });
    }

    checkIfLoggedIn(): boolean {
        return !!this.getDecodedIdToken()?.user_id;
    }

    checkIfAdmin(): boolean {
        return this.getDecodedIdToken()?.role === 'ADMIN';
    }

    getDecodedIdToken(): IdToken | null {
        return FirebaseIdTokenService.getDecodedIdToken();
    }
}
