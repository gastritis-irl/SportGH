import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, RouterLink, UrlSegment } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../product/product.model';
import { User } from '../../user/user.model';

@Component({
    selector: 'sgh-breadcrumb',
    standalone: true,
    imports: [
        RouterLink,
        NgForOf,
        NgIf
    ],
    templateUrl: './breadcrumb.component.html',
    styleUrls: [ './breadcrumb.component.scss' ],
})
export class BreadcrumbComponent implements OnInit {

    url: string[] = [];
    @Input() filter: Params | null = null;
    @Input() product: Product | null = null;
    @Input() user: User | null = null;
    @Output() breadcrumbEvent: EventEmitter<undefined> = new EventEmitter<undefined>();

    constructor(
        private route: ActivatedRoute,
        private toastNotify: ToastrService,
    ) {
    }

    ngOnInit(): void {
        this.route.url.subscribe(
            {
                next: (urlSegments: UrlSegment[]): void => {
                    for (const urlSegment of urlSegments) {
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
