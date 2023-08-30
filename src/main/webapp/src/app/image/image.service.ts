import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environment";
import { Image } from "./image.model";

@Injectable()
export class ImageService {

    constructor(private http: HttpClient) {
    }

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
}
