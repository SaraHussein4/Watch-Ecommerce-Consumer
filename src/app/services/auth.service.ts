import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  BackendUrl = 'https://localhost:7071'; // Adjust this URL as needed
  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
      return this.http.post(`${this.BackendUrl}/api/Account/Register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post('/api/Account/Login', credentials);
  }
  logout(): Observable<any> {
    return this.http.post('/api/Account/Logout', {});
  }
}
