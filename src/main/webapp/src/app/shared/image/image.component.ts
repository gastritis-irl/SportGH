import { ToastrService } from 'ngx-toastr';
import { Image } from './image.model';
import { ImageService } from './image.service';
import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'sgh-image',
    templateUrl: './image.component.html',
})
export class ImageComponent {

    @Output() fileChange = new EventEmitter<File>();

    imageFile?: File;
    imageData?: Image;

    constructor(private imageService: ImageService, private toastNotify: ToastrService) { }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length) {
            this.imageFile = input.files[0];
            this.fileChange.emit(this.imageFile);  // Emit the file whenever it changes
        }
    }


    upload() {
        if (!this.imageFile) {

            return;
        }

        this.imageService.uploadImage(this.imageFile).subscribe(
            (response: Image) => {
                // Successfully uploaded and received the Image object
                this.imageData = response;
            },
            error => {
                // Handle the error appropriately
                this.toastNotify.error(`Error uploading image`, error);
            }
        );
    }

    loadImageFile(id: number) {
        this.imageService.getImageFile(id).subscribe(blob => {
            const reader = new FileReader();
            reader.onload = () => {
                if (this.imageData) {
                    this.imageData.url = reader.result as string;
                } else {
                    this.toastNotify.error(`Error fetching data`);
                }
            };
            if (blob) {
                reader.readAsDataURL(blob);
            }
        });
    }
}
