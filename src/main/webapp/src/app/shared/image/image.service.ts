import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from './image.model';
import { AppService } from '../../app.service';
import { HttpHeaders } from "@angular/common/http";

@Injectable()
export class ImageService extends AppService {

    uploadImage(image: File, productId: number = 0): Observable<Image> {
        const formData = new FormData();
        formData.append('productId', productId.toString());
        formData.append('image', image);
        return this.httpPost<Image>(this.baseUrl + '/images', { body: formData });
    }

    getImageFilesByProductId(productId: number): Observable<{ id: number; name: string; data: Uint8Array }[]> {
        return this.httpGet<{
            id: number;
            name: string;
            data: Uint8Array
        }[]>(this.baseUrl + `/images/product/files/${productId}`, { responseType: 'json' });
    }

    getImageIdsByProductId(productId: number): Observable<Image[]> {
        return this.httpGet<Image[]>(this.baseUrl + `/images/product/${productId}`, { responseType: 'json' });
    }

    getImageModel(id: number): Observable<Image> {
        return this.httpGet<Image>(this.baseUrl + `/images/${id}`);
    }

    getImageFile(id: number): Observable<Blob> {
        const header: HttpHeaders = this.setHeaders();
        return this.http.get(this.baseUrl + `/images/file/${id}`, { headers: header, responseType: 'blob' });
    }

    updateFile(id: number, image: File, productId: number = 0): Observable<Image> {
        const formData = new FormData();
        formData.append('productId', productId.toString());
        formData.append('image', image);
        return this.httpPut<Image>(this.baseUrl + `/images/file/${id}`, { body: formData });
    }

    deleteImage(id: number): Observable<void> {
        return this.httpDelete<void>(this.baseUrl + `/images/${id}`);
    }
}
