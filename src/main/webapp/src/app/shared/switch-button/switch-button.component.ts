import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'sgh-switch-button',
    standalone: true,
    templateUrl: './switch-button.component.html',
    styleUrls: ['./switch-button.component.scss'],
})
export class SwitchButtonComponent implements OnInit {

    isChecked: boolean = false;

    @Output() checkEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit(): void {
    }

    check(): void {
        this.isChecked = !this.isChecked;
        this.checkEvent.emit(this.isChecked);
    }
}
