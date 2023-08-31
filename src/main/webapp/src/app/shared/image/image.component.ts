import { Image } from './image.model';
import { ImageService } from './image.service';
import { Component } from '@angular/core';

@Component({
    selector: 'sgh-image',
    templateUrl: './image.component.html',
})
export class ImageComponent {
    
    imageFile: File;
    imageData: Image;

    constructor(private imageService: ImageService) { }

    onFileChange(event) {
        this.imageFile = event.target.files[0];
    }

    upload() {
        this.imageService.uploadImage(this.imageFile).subscribe(
            (response: Image) => {
                // Successfully uploaded and received the Image object
                this.imageData = response;
            },
            error => {
                // Handle the error appropriately
                console.error('Upload failed', error);
            }
        );
    }

    loadImageFile(id: number) {
        this.imageService.getImageFile(id).subscribe(blob => {
            const reader = new FileReader();
            reader.onload = () => {
                this.imageData.url = reader.result as string;
            };
            if (blob) {
                reader.readAsDataURL(blob);
            }
        });
    }
}
