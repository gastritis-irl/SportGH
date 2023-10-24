import { Component, OnInit, TemplateRef } from '@angular/core';
import { RequestsService } from './requests.service';
import { Request, Status } from './requests.model';
import { ToastrService } from 'ngx-toastr';
import { NgForOf, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'sgh-requests',
    standalone: true,
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.scss'],
    imports: [
        NgForOf,
        NgIf
    ]
})
export class RequestsComponent implements OnInit {

    requests: Request[] = [];

    constructor(
        private requestsService: RequestsService,
        private toastNotify: ToastrService,
        private modalService: NgbModal
    ) {
    }

    ngOnInit(): void {
        this.requestsService.getMyRequests().subscribe({
            next: (requests: Request[]): void => {
                this.requests = requests;
                console.log(requests);
            },
            error: (): void => {
                this.toastNotify.error('Error fetching data');
            }
        });
    }

    answerRequest(requestId: number | undefined, answer: string): void {
        if (requestId) {
            this.requestsService.answerRequest(requestId, answer).subscribe({
                next: (): void => {
                },
                error: (): void => {
                    this.toastNotify.error('Error answering request.');
                }
            });
        } else {
            this.toastNotify.warning('Request does not exist');
        }
    }

    openRequestsModal(modalContent: TemplateRef<string>): void {
        this.modalService.dismissAll();
        this.modalService.open(modalContent, { centered: true, scrollable: true, animation: true });
    }

    protected readonly Status = Status;
}
