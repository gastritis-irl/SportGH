import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'sgh-popover-delete',
    standalone: true,
    imports: [
        NgbPopover
    ],
    templateUrl: './popover-delete.component.html'
})
export class PopoverDeleteComponent implements OnInit {

    @Input() deleteData: number[] = [];
    @Output() deleteEvent: EventEmitter<number[]> = new EventEmitter<number[]>();

    ngOnInit(): void {
    }

    delete(): void {
        this.deleteEvent.emit(this.deleteData);
    }
}
