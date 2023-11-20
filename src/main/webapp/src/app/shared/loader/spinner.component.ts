import { Component, ViewEncapsulation } from '@angular/core';
import { LoaderService } from './loader.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'sgh-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    standalone: true,
    imports: [
        NgIf
    ],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class SpinnerComponent {

    constructor(public loader: LoaderService) {
    }
}
