import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environment";
import { Image } from "./image.model";
import { AppService } from "../../app.service";

@Injectable()
export class ImageService extends AppService {

    uploadImage(image: File): Observable<Image> {
        const formData = new FormData();
        formData.append('image', image);
        return this.http.post<Image>(environment.baseURL + '/api/images', formData);
    }

    getImageModel(id: number): Observable<Image> {
        return this.http.get<Image>(environment.baseURL + `/api/images/${id}`);
    }

    getImageFile(id: number): Observable<Blob> {
        return this.http.get(environment.baseURL + `/api/images/file/${id}`, { responseType: 'blob' });
    }

    updateFile(id: number, image: File): Observable<Image> {
        const formData = new FormData();
        formData.append('image', image);
        return this.http.put<Image>(environment.baseURL + `/api/images/file/${id}`, formData);
    }

    deleteImage(id: number): Observable<void> {
        return this.http.delete<void>(environment.baseURL + `/api/images/${id}`);
    }
}
