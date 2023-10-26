import { Component, OnInit, TemplateRef } from '@angular/core';
import { RequestsService } from './requests.service';
import { Request, Status } from './requests.model';
import { ToastrService } from 'ngx-toastr';
import { NgForOf, NgIf } from '@angular/common';
import {
    NgbModal,
    NgbNav,
    NgbNavConfig,
    NgbNavContent,
    NgbNavItem,
    NgbNavLink,
    NgbNavOutlet
} from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'sgh-requests',
    standalone: true,
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.scss'],
    imports: [
        NgForOf,
        NgIf,
        NgbNavContent,
        NgbNav,
        NgbNavItem,
        NgbNavLink,
        RouterLink,
        NgbNavOutlet
    ]
})
export class RequestsComponent implements OnInit {

    requestsByOthers: Request[] = [];
    myRequests: Request[] = [];
    nrOfPendingRequests: number = 0;

    constructor(
        private requestsService: RequestsService,
        private toastNotify: ToastrService,
        private modalService: NgbModal,
        private navService: NgbNavConfig
    ) {
    }

    reloadData():void{
        this.getMyRequests();
        this.getOthersRequests();
        this.getNumberOfPendingRequests();
    }

    ngOnInit(): void {
        this.reloadData();
    }

    getMyRequests(): void {
        this.requestsService.getMyRequests().subscribe({
            next: (requests: Request[]): void => {
                this.myRequests = requests;
            },
            error: (): void => {
                this.toastNotify.error('Error fetching data');
            }
        });
    }

    getOthersRequests(): void {
        this.requestsService.getOthersRequests().subscribe({
            next: (requests: Request[]): void => {
                this.requestsByOthers = requests;
            },
            error: (): void => {
                this.toastNotify.error('Error fetching data');
            }
        });
    }

    getNumberOfPendingRequests(): void {
        this.nrOfPendingRequests = 0;
        for (let i: number = 0; i < this.requestsByOthers.length; i++) {
            if (this.requestsByOthers[i].requestStatus === Status.PENDING) {
                this.nrOfPendingRequests++;
            }
        }
    }

    answerRequest(requestId: number | undefined, answer: string): void {
        if (requestId) {
            this.requestsService.answerRequest(requestId, answer).subscribe({
                next: (): void => {
                    this.reloadData();
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
        this.navService.destroyOnHide = false;
        this.navService.roles = false;
        this.modalService.open(modalContent, { size: 'xl', centered: true, scrollable: true, animation: true });
    }

    protected readonly Status = Status;
}
