import { Component, OnInit } from '@angular/core';
import { RequestsService } from './requests.service';
import { Request } from './requests.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sgh-requests',
    standalone: true,
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.scss'],
})
export class RequestsComponent implements OnInit {

    requests: Request[] = [];

    constructor(private requestsService: RequestsService, private toastNotify: ToastrService) {
    }

    ngOnInit(): void {
        this.requestsService.getMyRequests().subscribe({
            next: (requests: Request[]): void => {
                this.requests = requests;
            },
            error: (): void => {
                this.toastNotify.error('Error fetching data');
            }
        });
    }
}
