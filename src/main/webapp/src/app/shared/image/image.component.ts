import { ToastrService } from 'ngx-toastr';
import { Image } from './image.model';
import { ImageService } from './image.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';

@Component({
    selector: 'sgh-image',
    standalone: true,
    imports: [NgIf, NgFor],
    styleUrls: ['./image.component.scss'],
    templateUrl: './image.component.html',
})
export class ImageComponent implements OnInit {

    @Input() allowMultiple: boolean = false;
    @Output() fileChange: EventEmitter<File[]> = new EventEmitter<File[]>();
    @Output() fileRemoved: EventEmitter<File> = new EventEmitter<File>();
    @Input() mode: 'edit' | 'create' = 'create';
    imageFiles: File[] = [];
    imageDataArray: Image[] = [];
    _imageIds?: number[] = [];

    constructor(private imageService: ImageService, private toastNotify: ToastrService) {
    }

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

            if (!this.allowMultiple) {
                this.imageFiles = [];
                this.imageDataArray = [];
            }

            this.fileChange.emit(newImageFiles);
            newImageFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    this.imageDataArray.push({ url: reader.result as string, isUploaded: false, file: file });
                };
                reader.readAsDataURL(file);
            });
            this.imageFiles = [...this.imageFiles, ...newImageFiles];
        }
    }



    deleteImage(index: number): void {
        const imageToDelete: Image = this.imageDataArray[index];
        if (imageToDelete) {
            if (imageToDelete.isUploaded) {
                if (!this.imageIds) {
                    return;
                }
                this.imageService.deleteImage(this.imageIds[index]).subscribe({
                    next: (): void => {
                        this.imageIds?.splice(index, 1);
                        this.imageDataArray.splice(index, 1);
                        this.toastNotify.success('Image deleted successfully');
                    },
                    error: (error): void => {
                        this.toastNotify.error('Error deleting image', error);
                    }
                });
            } else {
                this.imageFiles.splice(index, 1);
                this.imageDataArray.splice(index, 1);
                if (imageToDelete.file) {
                    this.fileRemoved.emit(imageToDelete.file);
                }
                this.toastNotify.success('Image deleted successfully');
            }
        }
    }

    loadImageFiles(ids: number[]): void {
        const nonZeroIds: number[] = ids.filter(id => id !== 0 && id !== undefined && id !== null);
        if (nonZeroIds.length > 0) {

            const loadObservables: Observable<Blob>[] = nonZeroIds.map(id => this.imageService.getImageFile(id));

            loadObservables.filter((observable: Observable<Blob>) => observable !== undefined && observable !== null);

            forkJoin(loadObservables).subscribe(blobs => {
                blobs.forEach((blob, index) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        this.imageDataArray[index] = {url: reader.result as string, isUploaded: true};
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
