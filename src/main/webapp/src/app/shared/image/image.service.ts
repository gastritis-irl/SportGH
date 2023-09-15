import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from './image.model';
import { AppService } from '../../app.service';

@Injectable()
export class ImageService extends AppService {

    uploadImage(image: File): Observable<Image> {
        const formData = new FormData();
        formData.append('image', image);
        return this.http.post<Image>(this.baseUrl + '/images', formData);
    }

    getImageModel(id: number): Observable<Image> {
        return this.http.get<Image>(this.baseUrl + `/images/${id}`);
    }

    getImageFile(id: number): Observable<Blob> {
        return this.http.get(this.baseUrl + `/images/file/${id}`, { responseType: 'blob' });
    }

    updateFile(id: number, image: File): Observable<Image> {
        const formData = new FormData();
        formData.append('image', image);
        return this.http.put<Image>(this.baseUrl + `/images/file/${id}`, formData);
    }

    deleteImage(id: number): Observable<void> {
        return this.http.delete<void>(this.baseUrl + `/images/${id}`);
    }

    readImageBlob(imageBlob: Blob): string {
        let image: string = '';
        const reader: FileReader = new FileReader();
        reader.onload = (): void => {
            image = reader.result as string;
        };
        if (imageBlob) {
            reader.readAsDataURL(imageBlob);
        }
        return image;
    }
}
