import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'sgh-home',
    templateUrl: './home.component.html',
    styleUrls: [ './home.component.scss' ],
})
export class HomeComponent implements OnInit {

    textSearch: string = '';

    constructor(private toastNotify: ToastrService, private router: Router) {
    }

    ngOnInit(): void {
    }

    searchForText(): void {
        this.router.navigate([ '/products' ], { queryParams: { pageNumber: 1, TextSearch: this.textSearch } })
            .catch(error => {
                console.error(error);
                this.toastNotify.error(`Error searching for ${this.textSearch}`);
            });
    }
}
