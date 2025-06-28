import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {jwtDecode } from 'jwt-decode'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userDataSubject = new BehaviorSubject<any>(null); 
  userData = this.userDataSubject.asObservable();
  BackendUrl = 'https://localhost:7071'; 
  constructor(private http: HttpClient) {
    this.decodeUserData();
   }

 decodeUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userDataSubject.next(decodedToken); 
        console.log('Decoded token:', decodedToken);
      } catch (e) {
        console.error('Invalid token:', e);
        this.userDataSubject.next(null);
      }
    } else {
      this.userDataSubject.next(null);
    }
  }

  register(userData: any): Observable<any> {
      return this.http.post(`${this.BackendUrl}/api/Account/Register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.BackendUrl}/api/Account/Login`, credentials);
  }
   logout(): Observable<any> {
    localStorage.removeItem('token');
    this.userDataSubject.next(null); 
    return this.http.post(`${this.BackendUrl}/api/Account/Logout`, {});
  }
}
