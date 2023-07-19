import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api'; // Replace with your Spring server URL

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    const url = `${this.baseUrl}/data`; // Replace 'data' with your Spring API endpoint
    return this.http.get<any>(url);
  }
}
