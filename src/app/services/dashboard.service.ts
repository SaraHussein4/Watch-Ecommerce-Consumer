import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
 private apiUrl = 'https://localhost:7071/api/Dashboard';
 constructor(private http: HttpClient) { }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }}
