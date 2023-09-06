import { ToastrService } from 'ngx-toastr';
import { Image } from './image.model';
import { ImageService } from './image.service';
import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'sgh-image',
    standalone: true,
    imports: [NgIf],
    styleUrls: ['./image.component.scss'],
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
            const reader = new FileReader();
            reader.onload = () => {
                this.imageData = { url: reader.result as string }; // Load image data for preview
            };
            reader.readAsDataURL(this.imageFile);
        }
    }


    upload() {
        if (!this.imageFile) {
            this.toastNotify.error(`No image selected`);
            return;
        }

        this.imageService.uploadImage(this.imageFile).subscribe(
            {
                next: (response: Image) => {
                    // Successfully uploaded and received the Image object
                    this.imageData = response;
                },
                error: (error) => {
                    this.toastNotify.error(`Error uploading image`, error);
                }
            }
        );
    }

    uploadImage(): Image | undefined {
        if (this.imageFile) {
            this.imageService.uploadImage(this.imageFile).subscribe(
                {
                    next: (response: Image) => {
                        // Successfully uploaded and received the Image object
                        this.imageData = response;
                        this.toastNotify.success('Image uploaded successfully');
                        return response;
                    },
                    error: (error) => {
                        this.toastNotify.error('Error uploading image', error);
                        return undefined;
                    }
                }
            );
        }
        return undefined;
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

    deleteFile(id: number) {
        this.imageService.deleteImage(id).subscribe(
            {
                next: (): void => {
                    // Successfully deleted the image
                    this.imageData = undefined;
                    this.imageFile = undefined;
                    this.toastNotify.success(`Image deleted successfully`);
                },
                error: (error): void => {
                    this.toastNotify.error(`Error deleting image`, error);
                }
            }
        );
    }

}
