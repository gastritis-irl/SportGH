import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'sgh-form-ch-lbl',
    standalone: true,
    imports: [ NgIf ],
    templateUrl: './form-check-label.component.html',
})
export class FormCheckLabelComponent implements OnInit {

    @Input() fieldName: string = '';
    @Input() fieldType?: string;
    @Input() required: boolean = false;
    // for strings
    @Input() length?: number;
    @Input() minlength?: number;
    @Input() maxlength?: number;
    // for numbers/dates
    @Input() value?: number;
    @Input() min?: number;
    @Input() max?: number;

    constructor() {
    }

    ngOnInit(): void {
    }

    isNumber(value: number | string | undefined): boolean {
        return typeof value === 'number';
    }
}
