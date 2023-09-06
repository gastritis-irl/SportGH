import { ToastrService } from 'ngx-toastr';
import { Image } from './image.model';
import { ImageService } from './image.service';
import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { of, forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OnInit } from '@angular/core';

@Component({
    selector: 'sgh-image',
    standalone: true,
    imports: [NgIf, NgFor],
    styleUrls: ['./image.component.scss'],
    templateUrl: './image.component.html',
})
export class ImageComponent implements OnInit {

    @Input() imageIds: number[] = [];
    @Input() allowMultiple: boolean = false;
    @Output() fileChange = new EventEmitter<File[]>();
    imageFiles: File[] = [];
    imageDataArray: Image[] = [];
    isMultiple: boolean = false;

    constructor(private imageService: ImageService, private toastNotify: ToastrService) { }

    ngOnInit(): void {
        if (this.imageIds && this.imageIds.length > 0) {
            this.loadImageFiles(this.imageIds);
        }
    }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length) {
            this.imageFiles = Array.from(input.files);
            this.isMultiple = this.imageFiles.length > 1;

            this.fileChange.emit(this.imageFiles);
            this.toastNotify.info(`Selected ${this.imageFiles.length} image(s)`);
            this.imageFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = () => {
                    this.imageDataArray[index] = { url: reader.result as string };
                };
                reader.readAsDataURL(file);
            });
        }
    }

    upload(): void {
        if (this.imageFiles.length === 0) {
            this.toastNotify.warning(`No image selected`);
            return;
        }

        this.imageFiles.forEach((file, index) => {
            this.imageService.uploadImage(file).subscribe({
                next: (response: Image) => {
                    this.imageDataArray[index] = response;
                },
                error: (error) => {
                    this.toastNotify.error(`Error uploading image`, error);
                }
            });
        });
    }

    uploadImages(): Observable<Image[]> {
        if (this.imageFiles.length === 0) {
            return of([]);
        }

        const uploadObservables = this.imageFiles.map(file => this.imageService.uploadImage(file));

        return forkJoin(uploadObservables).pipe(
            tap({
                next: (responses: Image[]) => {
                    this.imageDataArray = responses;
                },
                error: (error: undefined ) => {
                    this.toastNotify.error('Error uploading images', error);
                }
            })
        );
    }


    loadImageFiles(ids: number[]): void {
        const loadObservables = ids.map(id => this.imageService.getImageFile(id));

        forkJoin(loadObservables).subscribe(blobs => {
            blobs.forEach((blob, index) => {
                const reader = new FileReader();
                reader.onload = () => {
                    this.imageDataArray[index] = { url: reader.result as string };
                };
                if (blob) {
                    reader.readAsDataURL(blob);
                } else {
                    this.toastNotify.error(`Error fetching data for image ${ids[index]}`);
                }
            });
        });
    }

    deleteFiles(ids: number[]): void {
        const deleteObservables = ids.map(id => this.imageService.deleteImage(id));

        forkJoin(deleteObservables).subscribe({
            next: () => {
                this.imageDataArray = [];
                this.imageFiles = [];
                this.toastNotify.success(`Images deleted successfully`);
            },
            error: (error) => {
                this.toastNotify.error(`Error deleting images`, error);
            }
        });
    }
}
