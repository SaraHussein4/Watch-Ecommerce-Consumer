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
   logout(): void {
    localStorage.removeItem('token');
    this.userDataSubject.next(null); 
    // return this.http.post(`${this.BackendUrl}/api/Account/Logout`, {});
  }

  getUserId(): string | null {
  const user = this.userDataSubject.getValue();
  if (!user) return null;

  return user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || user['sub'] || null;
}
}
