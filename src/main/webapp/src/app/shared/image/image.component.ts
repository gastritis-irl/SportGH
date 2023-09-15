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

    @Input() allowMultiple: boolean = false;
    @Output() fileChange = new EventEmitter<File[]>();
    @Input() mode: 'edit' | 'create' = 'create';
    imageFiles: File[] = [];
    imageDataArray: Image[] = [];
    _imageIds?: number[] = [];

    constructor(private imageService: ImageService, private toastNotify: ToastrService) { }

    ngOnInit(): void {
        if (this.imageIds && this.imageIds.length > 0 && this.imageIds[0] !== 0) {
            this.loadImageFiles(this.imageIds);
        }
    }

    @Input()
    set imageIds(ids: number[] | undefined) {
        this._imageIds = ids;
        if (ids && ids.length > 0 && ids[0] !== 0) {
            this.loadImageFiles(ids);
        }
    }

    get imageIds(): number[] | undefined {
        return this._imageIds;
    }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length) {
            const newImageFiles = Array.from(input.files);

            this.fileChange.emit(newImageFiles);
            newImageFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    this.imageDataArray.push({ url: reader.result as string });
                };
                reader.readAsDataURL(file);
            });

            this.imageFiles = [...this.imageFiles, ...newImageFiles];
        }
    }


    deleteImage(index: number): void {
        if (this.imageFiles[index]) {
            this.imageFiles.splice(index, 1);
            this.imageDataArray.splice(index, 1);
            this.toastNotify.success('Image deleted successfully');
        } else {
            // delete from db
            if (!this.imageIds) {
                return;
            }
            this.imageService.deleteImage(this.imageIds[index]).subscribe({
                next: () => {
                    this.imageIds?.splice(index, 1);
                    this.imageDataArray.splice(index, 1);  // Add this line to remove the image from the array
                    this.toastNotify.success('Image deleted successfully');
                },
                error: (error) => {
                    this.toastNotify.error('Error deleting image', error);
                }
            });
        }
    }


    upload(): void {
        if (this.imageFiles.length === 0) {
            this.toastNotify.warning(`No image selected`);
            return;
        }

        this.imageFiles.forEach((file, index) => {
            if (!file) {
                this.imageService.uploadImage(file).subscribe({
                    next: (response: Image) => {
                        this.imageDataArray[index] = response;
                    },
                    error: (error) => {
                        this.toastNotify.error(`Error uploading image`, error);
                    }
                });
            }
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
        // this.toastNotify.info(`Loading ${ids.length} images`);
        const nonZeroIds = ids.filter(id => id !== 0 && id !== undefined && id !== null);
        // this.toastNotify.info(`Loading ${nonZeroIds.length} images from ${ids.length} ids with ${nonZeroIds.length>0} non-zero ids`);
        if (nonZeroIds.length > 0) {

            this.toastNotify.info(`${nonZeroIds.length > 0} images`)
            const loadObservables = nonZeroIds.map(id => this.imageService.getImageFile(id));
            this.toastNotify.info(`Loading ${nonZeroIds.length} images`);

            loadObservables.filter(observable => observable !== undefined && observable !== null);

            this.toastNotify.info(`Loading ${loadObservables.length} images`);
            forkJoin(loadObservables).subscribe(blobs => {
                blobs.forEach((blob, index) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        this.imageDataArray[index] = { url: reader.result as string };
                    };
                    if (blob) {
                        reader.readAsDataURL(blob);
                    } else {
                        this.toastNotify.error(`Error fetching data for image ${nonZeroIds[index]}`);
                    }
                });
            });
        }
    }
}
