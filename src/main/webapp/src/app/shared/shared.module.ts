import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffcanvasComponent } from './offcanvas/offcanvas.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [OffcanvasComponent],
    exports: [OffcanvasComponent], // Export so other modules can use it
    imports: [CommonModule, FormsModule],
})
export class SharedModule { }
