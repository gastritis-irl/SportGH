import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, UrlSegment } from '@angular/router';
import { NgForOf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sgh-breadcrumb',
    standalone: true,
    imports: [
        RouterLink,
        NgForOf
    ],
    templateUrl: './breadcrumb.component.html',
    styleUrls: [ './breadcrumb.component.scss' ],
})
export class BreadcrumbComponent implements OnInit {

    url: string[] = [];

    constructor(
        private route: ActivatedRoute,
        private toastNotify: ToastrService,
    ) {
    }

    ngOnInit(): void {
        this.route.url.subscribe(
            {
                next: (urlSegments: UrlSegment[]): void => {
                    for (let urlSegment of urlSegments) {
                        this.url.push(String(urlSegment));
                    }
                },
                error: (error: string): void => {
                    console.error(error);
                    this.toastNotify.error('Error loading breadcrumbs');
                }
            }
        );
    }
}
