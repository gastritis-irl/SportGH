import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    const url = `${this.baseUrl}/api/users`;
    return this.http.get<any>(url);
  }
}
