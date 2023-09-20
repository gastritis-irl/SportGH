import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from './image.model';
import { AppService } from '../../app.service';

@Injectable()
export class ImageService extends AppService {

    uploadImage(image: File, productId: number = 0): Observable<Image> {
        const formData = new FormData();
        formData.append('productId', productId.toString());
        formData.append('image', image);
        return this.http.post<Image>(this.baseUrl + '/images', formData);
    }

    getImageFilesByProductId(productId: number): Observable<{ id: number; name: string; data:Uint8Array}[]> {
        return this.http.get<{ id: number; name: string; data: Uint8Array }[]>(this.baseUrl + `/images/product/files/${productId}`, { responseType: 'json' });
    }

    getImageIdsByProductId(productId: number): Observable<Image[]> {
        return this.http.get<Image[]>(this.baseUrl + `/images/product/${productId}`, { responseType: 'json' });
    }

    getImageModel(id: number): Observable<Image> {
        return this.http.get<Image>(this.baseUrl + `/images/${id}`);
    }

    getImageFile(id: number): Observable<Blob> {
        return this.http.get(this.baseUrl + `/images/file/${id}`, { responseType: 'blob' });
    }

    updateFile(id: number, image: File, productId: number = 0): Observable<Image> {
        const formData = new FormData();
        formData.append('productId', productId.toString());
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
