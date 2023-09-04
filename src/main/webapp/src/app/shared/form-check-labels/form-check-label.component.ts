import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'sgh-form-ch-lbl',
    standalone: true,
    imports: [ NgIf ],
    templateUrl: './form-check-label.component.html',
    styleUrls: [ './form-check-label.component.scss' ],
})
export class FormCheckLabelComponent implements OnInit {

    @Input() fieldName: string = '';
    @Input() fieldType: string = '';
    @Input() required: boolean = false;
    // for strings
    @Input() length: number = 0;
    @Input() minlength: number = 0;
    @Input() maxlength: number = 0;
    // for numbers/dates
    @Input() value: number = 0;
    @Input() min: number = 0;
    @Input() max: number = 0;

    constructor() {
    }

    ngOnInit(): void {
    }

    isNumber(): boolean {
        return this.fieldType === 'number';
    }
}
