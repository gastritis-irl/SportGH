import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageComponent } from './image.component';

@NgModule({
    declarations: [
        ImageComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        ImageComponent
    ]
})
export class ImageModule { }